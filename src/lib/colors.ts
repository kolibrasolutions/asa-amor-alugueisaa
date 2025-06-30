// Cores predefinidas para vestidos de noiva e produtos
export const PREDEFINED_COLORS = [
  { value: 'branco', label: 'Branco', hex: '#FFFFFF' },
  { value: 'off-white', label: 'Off-White', hex: '#F7F7F7' },
  { value: 'marfim', label: 'Marfim', hex: '#FFFACD' },
  { value: 'champagne', label: 'Champagne', hex: '#F7E7CE' },
  { value: 'nude', label: 'Nude', hex: '#E8B4A0' },
  { value: 'rosa-claro', label: 'Rosa Claro', hex: '#FFE4E1' },
  { value: 'azul-claro', label: 'Azul Claro', hex: '#E6F3FF' },
  { value: 'dourado', label: 'Dourado', hex: '#FFD700' },
  { value: 'prateado', label: 'Prateado', hex: '#C0C0C0' },
  { value: 'outro', label: 'Outro', hex: '#9CA3AF' }
] as const;

export type ColorValue = typeof PREDEFINED_COLORS[number]['value']; 