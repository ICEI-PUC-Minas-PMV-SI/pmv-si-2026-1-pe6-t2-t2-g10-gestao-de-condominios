import { compactText, formatDateTime, onlyDigits } from '@/utils/formatters'

describe('formatters utils', () => {
  it('remove caracteres nao numericos', () => {
    expect(onlyDigits('(31) 99999-0000')).toBe('31999990000')
    expect(onlyDigits('APT 1204 bloco B')).toBe('1204')
  })

  it('retorna texto padrao quando data nao for informada', () => {
    expect(formatDateTime(null)).toMatch(/informado/i)
  })

  it('formata data e hora no padrao brasileiro', () => {
    expect(formatDateTime('2026-05-30T15:45:00-03:00')).toMatch(/30\/05\/2026/)
  })

  it('mantem textos menores que o limite sem alteracao', () => {
    expect(compactText('Aviso curto', 20)).toBe('Aviso curto')
  })

  it('compacta textos longos com reticencias', () => {
    expect(compactText('Comunicado importante para todos os moradores', 18)).toBe('Comunicado impo...')
  })
})
