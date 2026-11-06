export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export function fields(value: unknown, allowed: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !allowed.includes(key))) throw new ApiError(422, 'invalid_input', 'Revise os campos enviados.');
  return value as Record<string, unknown>;
}
export function text(value: unknown, max: number): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new ApiError(422, 'invalid_input', 'Preencha uma resposta dentro do limite indicado.');
  return value.trim();
}
export function version(value: unknown, current: number) {
  if (!Number.isSafeInteger(value) || value !== current) throw new ApiError(409, 'brief_conflict', 'A conversa foi atualizada em outra aba. Recarregue as respostas antes de continuar.');
}
