(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const messages = $('#assistant-messages');
  const input = $('#assistant-input');
  let moved = false;
  const initialMessages = messages.innerHTML;
  const history = $('#history-list');
  const initialHistory = history.innerHTML;

  function addMessage(text, user = false) {
    const item = document.createElement('div');
    item.className = 'assistant-message' + (user ? ' user-message' : '');
    const author = document.createElement('span');
    author.className = 'message-author';
    author.textContent = user ? 'VOCÊ' : 'CATALISA';
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    item.append(author, paragraph);
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }
  function setActiveStep(action) {
    for (const button of $$('.demo-steps button')) button.classList.toggle('is-active', button.dataset.action === action);
  }
  function selectRecordTab(name, focus = false) {
    for (const button of $$('[data-record-tab]')) {
      const active = button.dataset.recordTab === name;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      $('#' + button.getAttribute('aria-controls')).hidden = !active;
      if (active && focus) button.focus();
    }
  }
  function consult(showPrompt = true) {
    if (showPrompt) addMessage('Resuma o histórico desta negociação.', true);
    const reply = addMessage('Projeto Aurora está em ' + (moved ? 'Proposta enviada' : 'Qualificação') + '. A equipe registrou estas informações:');
    const list = document.createElement('ul');
    for (const text of ['O cliente procura organizar o atendimento comercial.', 'As prioridades da equipe foram registradas na conversa de descoberta.', moved ? 'A etapa foi atualizada para Proposta enviada neste exemplo.' : 'O cliente pediu detalhamento de escopo e condições.']) {
      const item = document.createElement('li'); item.textContent = text; list.append(item);
    }
    const source = document.createElement('span');
    source.className = 'message-source'; source.textContent = 'Origem: histórico da negociação Projeto Aurora.';
    reply.append(list, source);
    setActiveStep('consult');
    messages.scrollTop = messages.scrollHeight;
  }
  function move(showPrompt = true) {
    if (showPrompt) addMessage('Mova esta oportunidade para proposta enviada.', true);
    if (moved) { addMessage('Projeto Aurora já está em Proposta enviada. A movimentação deste exemplo já foi registrada.'); return; }
    moved = true;
    $('[data-workspace]').dataset.complete = 'true';
    $('[data-stage-label]').textContent = 'Proposta enviada';
    $('[data-composer-stage]').textContent = 'Proposta enviada';
    $('[data-next-step]').textContent = 'Acompanhar retorno';
    $('[data-update-marker]').hidden = false;
    $('#record-confirmation').hidden = false;
    for (const step of $$('.stage-track li')) {
      if (step.dataset.stage === 'proposal') step.setAttribute('aria-current', 'step'); else step.removeAttribute('aria-current');
    }
    const event = document.createElement('li');
    event.className = 'history-new';
    const title = document.createElement('span'); title.textContent = 'Movimentação registrada';
    const description = document.createElement('p'); description.textContent = 'Etapa alterada: Qualificação → Proposta enviada. Alteração solicitada no assistente deste exemplo.';
    event.append(title, description); history.prepend(event);
    const reply = addMessage('Etapa atualizada. Projeto Aurora está em Proposta enviada.');
    const result = document.createElement('div'); result.className = 'message-success';
    const check = document.createElement('span'); check.textContent = '✓';
    const text = document.createElement('span'); text.textContent = 'A alteração aparece na ficha e no histórico.';
    result.append(check, text); reply.append(result);
    selectRecordTab('overview');
    setActiveStep('move');
    messages.scrollTop = messages.scrollHeight;
  }
  function verify(showPrompt = true) {
    if (!moved) {
      addMessage('A oportunidade continua em Qualificação. Peça a mudança de etapa para ver a ficha e o histórico serem atualizados.');
      selectRecordTab('history'); setActiveStep('verify'); return;
    }
    if (showPrompt) addMessage('Mostre o que foi feito.', true);
    addMessage('Confira a ficha: Projeto Aurora está em Proposta enviada. O histórico registra a movimentação de Qualificação para Proposta enviada.');
    selectRecordTab('history');
    setActiveStep('verify');
    messages.scrollTop = messages.scrollHeight;
  }
  for (const button of $$('[data-action]')) button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'consult') consult();
    else if (action === 'move') move();
    else verify();
  });
  $('#assistant-form').addEventListener('submit', event => {
    event.preventDefault();
    const request = input.value.trim();
    if (!request) { input.focus(); return; }
    addMessage(request, true);
    input.value = '';
    const normalized = request.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (/\b(mova|mover|altere|alterar|passe|coloque|colocar)\b/.test(normalized) && /proposta/.test(normalized)) move(false);
    else if (/feito|confer|verifi|alterac|o que fez/.test(normalized)) verify(false);
    else if (/resum|histor|context|situac|como esta|negociac/.test(normalized)) consult(false);
    else addMessage('Neste exemplo, experimente consultar o histórico, mover a oportunidade para proposta enviada ou conferir o que foi feito.');
    input.focus();
  });
  input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); $('#assistant-form').requestSubmit(); } });
  $('#reset-demo').addEventListener('click', () => {
    moved = false;
    $('[data-workspace]').removeAttribute('data-complete');
    $('[data-stage-label]').textContent = 'Qualificação';
    $('[data-composer-stage]').textContent = 'Qualificação';
    $('[data-next-step]').textContent = 'Preparar proposta';
    $('[data-update-marker]').hidden = true;
    $('#record-confirmation').hidden = true;
    for (const step of $$('.stage-track li')) {
      if (step.dataset.stage === 'qualification') step.setAttribute('aria-current', 'step'); else step.removeAttribute('aria-current');
    }
    history.innerHTML = initialHistory;
    messages.innerHTML = initialMessages;
    input.value = '';
    selectRecordTab('overview'); setActiveStep('');
  });
  for (const [index, button] of $$('[data-record-tab]').entries()) {
    button.addEventListener('click', () => selectRecordTab(button.dataset.recordTab));
    button.addEventListener('keydown', event => {
      const tabs = $$('[data-record-tab]');
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); selectRecordTab(tabs[(index + 1) % tabs.length].dataset.recordTab, true);
      }
    });
  }
  const foundations = {
    context: ['O pedido tem um contexto.', 'No painel, o módulo, o registro e os recursos selecionados ajudam a situar o trabalho que você está pedindo.'],
    connections: ['Informação e ação nos sistemas conectados.', 'As integrações definem o que pode ser consultado e quais ações ficam disponíveis. Cada jornada tem seu escopo de conexão.'],
    rules: ['A operação conserva suas responsabilidades.', 'Permissões e autonomia definidas para cada ação orientam o que pode ser executado e o que precisa de aprovação.'],
  };
  function selectFoundation(button, focus = false) {
    const key = button.dataset.foundation;
    for (const candidate of $$('[data-foundation]')) { const active = candidate === button; candidate.setAttribute('aria-selected', String(active)); candidate.tabIndex = active ? 0 : -1; }
    $('#foundation-title').textContent = foundations[key][0];
    $('#foundation-description').textContent = foundations[key][1];
    $('#foundation-panel').setAttribute('aria-labelledby', button.id);
    for (const path of $$('[data-foundation-path]')) path.classList.toggle('is-active', path.dataset.foundationPath === key);
    if (focus) button.focus();
  }
  for (const [index, button] of $$('[data-foundation]').entries()) {
    button.addEventListener('click', () => selectFoundation(button));
    button.addEventListener('keydown', event => {
      const all = $$('[data-foundation]');
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % all.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + all.length) % all.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = all.length - 1;
      if (next !== undefined) { event.preventDefault(); selectFoundation(all[next], true); }
    });
  }
  selectFoundation($('[data-foundation=context]'));
})();
