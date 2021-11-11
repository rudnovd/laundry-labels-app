import type { laundryIcon } from '@/interfaces/laundryIcon'

export const laundryIcons: Array<laundryIcon> = [
  {
    _id: 'iron',
    icon: 'app:laundry-icon-iron',
    path: '/icons/laundry/ironing/wh-iron.svg',
    group: 'ironing',
    description: 'Iron allowed',
  },
  {
    _id: 'bleach',
    icon: 'app:laundry-icon-bleach',
    path: '/icons/laundry/bleach.svg',
    group: 'bleaching',
    description: 'Bleach allowed',
  },
  {
    _id: 'bleach-chlorine',
    icon: 'app:laundry-icon-bleach-chlorine',
    path: '/icons/laundry/bleach-chlorine.svg',
    group: 'bleaching',
    description: 'Bleach chlorine allowed',
  },
  {
    _id: 'bleach-only-non-chlorine',
    icon: 'app:laundry-icon-bleach-only-non-chlorine',
    path: '/icons/laundry/bleach-only-non-chlorine.svg',
    group: 'bleaching',
    description: 'Bleach only non chlorine',
  },
  {
    _id: 'do-not-bleach',
    icon: 'app:laundry-icon-do-not-bleach',
    path: '/icons/laundry/do-not-bleach.svg',
    group: 'bleaching',
    description: 'Bleach not allowed',
  },
  {
    _id: 'any-solvent',
    icon: 'app:laundry-icon-dry-cleaning-any-solvent',
    path: '/icons/laundry/dry-cleaning-any-solvent.svg',
    group: 'dry cleaning',
    description: 'Dry cleaning any solvent',
  },
  {
    _id: 'any-solvent-except',
    icon: 'app:laundry-icon-dry-cleaning-any-solvent-except',
    path: '/icons/laundry/dry-cleaning-any-solvent-except.svg',
    group: 'dry cleaning',
    description: 'Dry cleaning solvent except',
  },
  {
    _id: 'do-not-dry-clean',
    icon: 'app:laundry-icon-do-not-dry-clean',
    path: '/icons/laundry/dry-cleaning-do-not-dry-clean.svg',
    group: 'dry cleaning',
    description: 'Do not dry clean',
  },
  {
    _id: 'dry-clean',
    icon: 'app:laundry-icon-dry-clean',
    path: '/icons/laundry/dry-cleaning-dry-clean.svg',
    group: 'dry cleaning',
    description: 'Dry clean allowed',
  },
  {
    _id: 'dry-clean-petrolium-solvent',
    icon: 'app:laundry-icon-dry-cleaning-petrolium-solvent',
    path: '/icons/laundry/dry-cleaning-petrolium-solvent.svg',
    group: 'dry cleaning',
    description: 'Dry cleaning petrolium solvent',
  },
]

export const laundryIconsMap: { [key: string]: laundryIcon } = {}

laundryIcons.forEach((laundryIcon) => (laundryIconsMap[laundryIcon._id] = laundryIcon))
