import {describe,it,expect} from 'vitest';
import {compileHtml} from './compile-redesign-html.mjs';

describe('Prototype HTML migration',()=>{
  it('preserves native form constraints in React attributes',()=>{
    const jsx=compileHtml('<form novalidate><textarea rows="2" maxlength="1200" tabindex="-1"></textarea><input autocomplete="name" maxlength="100"></form>');
    expect(jsx).toContain('noValidate={true}');
    expect(jsx).toContain('rows={2} maxLength={1200} tabIndex={-1}');
    expect(jsx).toContain('autoComplete={"name"} maxLength={100}');
  });
  it('preserves classes that control responsive labels and product diagrams',()=>{
    const jsx=compileHtml('<div class="wrap label text-link c-desktop-label c-mobile-label bk-display-label x-wrap custom-text-link"></div>');
    expect(jsx).toContain('className={"c-wrap c-eyebrow c-text-link c-desktop-label c-mobile-label bk-display-label x-wrap custom-text-link"}');
  });
  it('keeps downloadable files as browser anchors while routing page links',()=>{
    const jsx=compileHtml('<a download href="/redesign/brand/kit.zip">Baixar</a><a href="/studio/">Studio</a>');
    expect(jsx).toContain('<a download={""} href={"/redesign/brand/kit.zip"}>');
    expect(jsx).toContain('<Link to={"/studio/"}>');
  });
});
