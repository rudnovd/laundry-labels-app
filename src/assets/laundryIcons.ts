import type { LaundryIcon } from '@/interfaces/laundryIcon'

export const laundryIcons: Array<LaundryIcon> = [
  {
    _id: 'wash',
    group: 'washing',
    description: 'Wash',
  },
  {
    _id: 'do-not-wash',
    group: 'washing',
    description: 'Do not wash',
  },
  {
    _id: 'hand-wash',
    group: 'washing',
    description: 'Hand wash',
  },
  {
    _id: 'wash-30',
    group: 'washing',
    description: 'Wash at 30 or lower °C',
  },
  {
    _id: 'wash-40',
    group: 'washing',
    description: 'Wash at 40 or lower °C',
  },
  {
    _id: 'wash-50',
    group: 'washing',
    description: 'Wash at 50 or lower °C',
  },
  {
    _id: 'wash-60',
    group: 'washing',
    description: 'Wash at 60 or lower °C',
  },
  {
    _id: 'iron',
    group: 'ironing',
    description: 'Iron',
  },
  {
    _id: 'do-not-iron',
    group: 'ironing',
    description: 'Do not iron',
  },
  {
    _id: 'iron-low-temperature',
    group: 'ironing',
    description: 'Iron low temperature (max 110 °C)',
  },
  {
    _id: 'iron-medium-temperature',
    group: 'ironing',
    description: 'Iron medium temperature (max 150 °C)',
  },
  {
    _id: 'iron-high-temperature',
    group: 'ironing',
    description: 'Iron high temperature (max 200 °C)',
  },
  {
    _id: 'bleach',
    group: 'bleaching',
    description: 'Bleach',
  },
  {
    _id: 'do-not-bleach',
    group: 'bleaching',
    description: 'Do not bleach',
  },
  {
    _id: 'bleach-with-chlorine',
    group: 'bleaching',
    description: 'Bleach with chlorine',
  },
  {
    _id: 'bleach-only-non-chlorine',
    group: 'bleaching',
    description: 'Bleach only non chlorine',
  },
  {
    _id: 'dry-tumble',
    group: 'drying',
    description: 'Tumble dry',
  },
  {
    _id: 'do-not-tumble-dry',
    group: 'drying',
    description: 'Do not tumble dry',
  },
  {
    _id: 'dry-tumble-low-heat',
    group: 'drying',
    description: 'Tumble dry on low heat',
  },
  {
    _id: 'dry-tumble-medium-heat',
    group: 'drying',
    description: 'Tumble dry on medium heat',
  },
  {
    _id: 'dry-drip',
    group: 'drying',
    description: 'Drip dry',
  },
  {
    _id: 'dry-flat',
    group: 'drying',
    description: 'Dry flat',
  },
  {
    _id: 'dry-clean',
    group: 'dry cleaning',
    description: 'Dry clean',
  },
  {
    _id: 'do-not-dry-clean',
    group: 'dry cleaning',
    description: 'Do not dry clean',
  },
  {
    _id: 'dry-clean-hydrocarbon-solvent-only',
    group: 'dry cleaning',
    description: 'Dry clean with hydrocarbon solvent only',
  },
  {
    _id: 'dry-clean-gentle-hydrocarbon-solvent-only',
    group: 'dry cleaning',
    description: 'Gentle clean with hydrocarbon solvent only',
  },
  {
    _id: 'dry-clean-very-gentle-with-hydrocarbon-solvents',
    group: 'dry cleaning',
    description: 'Very gentle clean with hydrocarbon solvent only',
  },
  {
    _id: 'dry-clean-tetrachloroethylene-solvent-only',
    group: 'dry cleaning',
    description: 'Dry clean with tetrachloroethylene (PCE) only',
  },
  {
    _id: 'dry-clean-gentle-tetrachloroethylene-only',
    group: 'dry cleaning',
    description: 'Gentle clean with tetrachloroethylene (PCE) only',
  },
  {
    _id: 'dry-clean-very-gentle-tetrachloroethylene-only',
    group: 'dry cleaning',
    description: 'Very gentle clean with tetrachloroethylene (PCE) only',
  },
  {
    _id: 'wet-cleaning',
    group: 'wet cleaning',
    description: 'Wet clean',
  },
  {
    _id: 'do-not-wet-cleaning',
    group: 'wet cleaning',
    description: 'Do not wet clean',
  },
  {
    _id: 'wet-cleaning-gentle',
    group: 'wet cleaning',
    description: 'Gentle wet clean',
  },
  {
    _id: 'wet-cleaning-very-gentle',
    group: 'wet cleaning',
    description: 'Very gentle wet clean',
  },
]

export const laundryIconsMap: { [key: string]: LaundryIcon } = {}

laundryIcons.forEach((laundryIcon) => (laundryIconsMap[laundryIcon._id] = laundryIcon))

export const laundryIconsByGroup: { [key: string]: Array<LaundryIcon> } = {
  washing: [],
  ironing: [],
  bleaching: [],
  drying: [],
  'dry cleaning': [],
  'wet cleaning': [],
}

laundryIcons.forEach((laundryIcon) => laundryIconsByGroup[laundryIcon.group].push(laundryIcon))
