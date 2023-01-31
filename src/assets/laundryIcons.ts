import type { LaundryIcon } from '@/interfaces/laundryIcon'

export const laundryIcons: Array<LaundryIcon> = [
  {
    _id: 'wash',
    group: 'washing',
    description: 'Machine wash',
  },
  {
    _id: 'mild-wash',
    group: 'washing',
    description: 'Mild machine wash',
  },
  {
    _id: 'very-mild-wash',
    group: 'washing',
    description: 'Very mild machine wash',
  },
  {
    _id: 'hand-wash',
    group: 'washing',
    description: 'Hand wash',
  },
  {
    _id: 'do-not-wash',
    group: 'washing',
    description: 'Do not wash',
  },
  {
    _id: 'wash-cold',
    group: 'washing',
    description: 'Wash at or below 30°C',
  },
  {
    _id: 'mild-wash-cold',
    group: 'washing',
    description: 'Mild wash at or below 30°C',
  },
  {
    _id: 'very-mild-wash-cold',
    group: 'washing',
    description: 'Very mild wash at or below 30°C',
  },
  {
    _id: 'wash-warm',
    group: 'washing',
    description: 'Wash at or below 40°C',
  },
  {
    _id: 'mild-wash-warm',
    group: 'washing',
    description: 'Mild wash at or below 40°C',
  },
  {
    _id: 'very-mild-wash-warm',
    group: 'washing',
    description: 'Very mild wash at or below 40°C',
  },
  {
    _id: 'wash-hot',
    group: 'washing',
    description: 'Wash at or below 50°C',
  },
  {
    _id: 'mild-wash-hot',
    group: 'washing',
    description: 'Mild wash at or below 50°C',
  },
  {
    _id: 'very-mild-wash-hot',
    group: 'washing',
    description: 'Very mild wash at or below 50°C',
  },
  {
    _id: 'wash-very-hot',
    group: 'washing',
    description: 'Wash at or below 60°C',
  },
  {
    _id: 'mild-wash-very-hot',
    group: 'washing',
    description: 'Mild wash at or below 60°C',
  },
  {
    _id: 'very-mild-wash-very-hot',
    group: 'washing',
    description: 'Very mild wash at or below 60°C',
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
    _id: 'iron-low',
    group: 'ironing',
    description: 'Iron at low temperature (max. 110°C)',
  },
  {
    _id: 'iron-medium',
    group: 'ironing',
    description: 'Iron at medium temperature (max. 150°C)',
  },
  {
    _id: 'iron-high',
    group: 'ironing',
    description: 'Iron at high temperature (max. 200°C)',
  },
  {
    _id: 'iron-steam',
    group: 'ironing',
    description: 'Iron with steam',
  },
  {
    _id: 'iron-do-not-steam',
    group: 'ironing',
    description: 'Do not steam',
  },
  {
    _id: 'bleach',
    group: 'bleaching',
    description: 'Bleaching allowed',
  },
  {
    _id: 'do-not-bleach',
    group: 'bleaching',
    description: 'Do not bleach',
  },
  {
    _id: 'non-chlorine-bleach',
    group: 'bleaching',
    description: 'Non-chlorine bleach',
  },
  {
    _id: 'tumble-dry',
    group: 'drying',
    description: 'Tumble dry allowed',
  },
  {
    _id: 'do-not-tumble-dry',
    group: 'drying',
    description: 'Do not tumble dry',
  },
  {
    _id: 'tumble-dry-low-heat',
    group: 'drying',
    description: 'Tumble dry on low heat',
  },
  {
    _id: 'tumble-dry-medium-heat',
    group: 'drying',
    description: 'Tumble dry on medium heat',
  },
  {
    _id: 'tumble-dry-high-heat',
    group: 'drying',
    description: 'Tumble dry on high heat',
  },
  {
    _id: 'drip-dry',
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
    group: 'dry-cleaning',
    description: 'Dry clean',
  },
  {
    _id: 'do-not-dry-clean',
    group: 'dry-cleaning',
    description: 'Do not dry clean',
  },
  {
    _id: 'dry-clean-petroleum',
    group: 'dry-cleaning',
    description: 'Dry clean with petroleum solvent',
  },
  {
    _id: 'gentle-dry-clean-petroleum',
    group: 'dry-cleaning',
    description: 'Gentle dry clean with petroleum solvent',
  },
  {
    _id: 'very-gentle-dry-clean-petroleum',
    group: 'dry-cleaning',
    description: 'Very gentle dry clean with petroleum solvent',
  },
  {
    _id: 'dry-clean-pce',
    group: 'dry-cleaning',
    description: 'Dry clean with PCE',
  },
  {
    _id: 'gentle-dry-clean-pce',
    group: 'dry-cleaning',
    description: 'Gentle clean with PCE',
  },
  {
    _id: 'very-gentle-dry-clean-pce',
    group: 'dry-cleaning',
    description: 'Very gentle clean with PCE',
  },
  {
    _id: 'wet-clean',
    group: 'wet-cleaning',
    description: 'Wet clean allowed',
  },
  {
    _id: 'do-not-wet-clean',
    group: 'wet-cleaning',
    description: 'Do not wet clean',
  },
  {
    _id: 'gentle-wet-clean',
    group: 'wet-cleaning',
    description: 'Gentle wet clean',
  },
  {
    _id: 'very-gentle-wet-clean',
    group: 'wet-cleaning',
    description: 'Very gentle wet clean',
  },
]

export const laundryIconsMap: { [key: string]: LaundryIcon } = {}

laundryIcons.forEach((laundryIcon) => (laundryIconsMap[laundryIcon._id] = laundryIcon))

export const laundryIconsByGroup: { [key: string]: Array<LaundryIcon> } = {
  washing: [],
  bleaching: [],
  ironing: [],
  drying: [],
  'dry-cleaning': [],
  'wet-cleaning': [],
}

laundryIcons.forEach((laundryIcon) => laundryIconsByGroup[laundryIcon.group].push(laundryIcon))
