import type { LaundryIcon } from '@/interfaces/laundryIcon'

export const laundryIcons: Array<LaundryIcon> = [
  {
    _id: 'wash',
    group: 'washing',
    description: 'icons.wash',
  },
  {
    _id: 'mild-wash',
    group: 'washing',
    description: 'icons.mild-wash',
  },
  {
    _id: 'very-mild-wash',
    group: 'washing',
    description: 'icons.very-mild-wash',
  },
  {
    _id: 'hand-wash',
    group: 'washing',
    description: 'icons.hand-wash',
  },
  {
    _id: 'do-not-wash',
    group: 'washing',
    description: 'icons.do-not-wash',
  },
  {
    _id: 'wash-cold',
    group: 'washing',
    description: 'icons.wash-cold',
  },
  {
    _id: 'mild-wash-cold',
    group: 'washing',
    description: 'icons.mild-wash-cold',
  },
  {
    _id: 'very-mild-wash-cold',
    group: 'washing',
    description: 'icons.very-mild-wash-cold',
  },
  {
    _id: 'wash-warm',
    group: 'washing',
    description: 'icons.wash-warm',
  },
  {
    _id: 'mild-wash-warm',
    group: 'washing',
    description: 'icons.mild-wash-warm',
  },
  {
    _id: 'very-mild-wash-warm',
    group: 'washing',
    description: 'icons.very-mild-wash-warm',
  },
  {
    _id: 'wash-hot',
    group: 'washing',
    description: 'icons.wash-hot',
  },
  {
    _id: 'mild-wash-hot',
    group: 'washing',
    description: 'icons.mild-wash-hot',
  },
  {
    _id: 'very-mild-wash-hot',
    group: 'washing',
    description: 'icons.very-mild-wash-hot',
  },
  {
    _id: 'wash-very-hot',
    group: 'washing',
    description: 'icons.wash-very-hot',
  },
  {
    _id: 'mild-wash-very-hot',
    group: 'washing',
    description: 'icons.mild-wash-very-hot',
  },
  {
    _id: 'very-mild-wash-very-hot',
    group: 'washing',
    description: 'icons.very-mild-wash-very-hot',
  },
  {
    _id: 'iron',
    group: 'ironing',
    description: 'icons.iron',
  },
  {
    _id: 'do-not-iron',
    group: 'ironing',
    description: 'icons.do-not-iron',
  },
  {
    _id: 'iron-low',
    group: 'ironing',
    description: 'icons.iron-low',
  },
  {
    _id: 'iron-medium',
    group: 'ironing',
    description: 'icons.iron-medium',
  },
  {
    _id: 'iron-high',
    group: 'ironing',
    description: 'icons.iron-high',
  },
  {
    _id: 'iron-steam',
    group: 'ironing',
    description: 'icons.iron-steam',
  },
  {
    _id: 'iron-do-not-steam',
    group: 'ironing',
    description: 'icons.iron-do-not-steam',
  },
  {
    _id: 'bleach',
    group: 'bleaching',
    description: 'icons.bleach',
  },
  {
    _id: 'do-not-bleach',
    group: 'bleaching',
    description: 'icons.do-not-bleach',
  },
  {
    _id: 'non-chlorine-bleach',
    group: 'bleaching',
    description: 'icons.non-chlorine-bleach',
  },
  {
    _id: 'tumble-dry',
    group: 'drying',
    description: 'icons.tumble-dry',
  },
  {
    _id: 'do-not-tumble-dry',
    group: 'drying',
    description: 'icons.do-not-tumble-dry',
  },
  {
    _id: 'tumble-dry-low-heat',
    group: 'drying',
    description: 'icons.tumble-dry-low-heat',
  },
  {
    _id: 'tumble-dry-medium-heat',
    group: 'drying',
    description: 'icons.tumble-dry-medium-heat',
  },
  {
    _id: 'tumble-dry-high-heat',
    group: 'drying',
    description: 'icons.tumble-dry-high-heat',
  },
  {
    _id: 'drip-dry',
    group: 'drying',
    description: 'icons.drip-dry',
  },
  {
    _id: 'dry-flat',
    group: 'drying',
    description: 'icons.dry-flat',
  },
  {
    _id: 'dry-clean',
    group: 'dry-cleaning',
    description: 'icons.dry-clean',
  },
  {
    _id: 'do-not-dry-clean',
    group: 'dry-cleaning',
    description: 'icons.do-not-dry-clean',
  },
  {
    _id: 'dry-clean-petroleum',
    group: 'dry-cleaning',
    description: 'icons.dry-clean-petroleum',
  },
  {
    _id: 'gentle-dry-clean-petroleum',
    group: 'dry-cleaning',
    description: 'icons.gentle-dry-clean-petroleum',
  },
  {
    _id: 'very-gentle-dry-clean-petroleum',
    group: 'dry-cleaning',
    description: 'icons.very-gentle-dry-clean-petroleum',
  },
  {
    _id: 'dry-clean-pce',
    group: 'dry-cleaning',
    description: 'icons.dry-clean-pce',
  },
  {
    _id: 'gentle-dry-clean-pce',
    group: 'dry-cleaning',
    description: 'icons.gentle-dry-clean-pce',
  },
  {
    _id: 'very-gentle-dry-clean-pce',
    group: 'dry-cleaning',
    description: 'icons.very-gentle-dry-clean-pce',
  },
  {
    _id: 'wet-clean',
    group: 'wet-cleaning',
    description: 'icons.wet-clean',
  },
  {
    _id: 'do-not-wet-clean',
    group: 'wet-cleaning',
    description: 'icons.do-not-wet-clean',
  },
  {
    _id: 'gentle-wet-clean',
    group: 'wet-cleaning',
    description: 'icons.gentle-wet-clean',
  },
  {
    _id: 'very-gentle-wet-clean',
    group: 'wet-cleaning',
    description: 'icons.very-gentle-wet-clean',
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
