import { type WatchStopHandle, computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Notify, useQuasar } from 'quasar'
import Shepherd from 'shepherd.js'
import { offset } from '@floating-ui/vue'
import { demoStorage } from '@/utils/localStorage'
import 'shepherd.js/dist/css/shepherd.css'
import '@/styles/demo.css'

type TourButtonAction = 'next' | 'finish'

function allowTouchmove(touchEvent: TouchEvent) {
  touchEvent.stopPropagation()
}

let pageWatcher: null | WatchStopHandle = null
export const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    classes: 'text-dark text-bold',
    floatingUIOptions: {
      middleware: [offset({ mainAxis: 15 })],
    },
    when: {
      show() {
        const target = this.getTarget()
        if (target) {
          target.addEventListener('touchmove', allowTouchmove)
        }
      },
      hide() {
        const target = this.getTarget()
        if (target) {
          target.removeEventListener('touchmove', allowTouchmove)
        }
      },
    },
  },
  steps: [],
})

export default function useDemoMode() {
  const router = useRouter()
  const { t } = useI18n()
  const { notify } = useQuasar()
  const previousPage = ref()

  const buttons = computed<Record<TourButtonAction, Shepherd.Step.StepOptionsButton>>(() => {
    return {
      next: {
        text: t('demo.buttons.next'),
        action: () => changeStep('next'),
      },
      finish: {
        text: t('demo.buttons.finish'),
        action: complete,
        classes: 'q-mr-auto bg-negative',
      },
    }
  })

  const steps = computed<Array<Shepherd.Step.StepOptions>>(() => {
    return [
      {
        id: 'Add first item',
        text: t('demo.tours.modifyItem.steps.addFirstItem'),
        attachTo: {
          element: 'a[href="/items/create"]',
          on: 'bottom',
        },
        advanceOn: {
          selector: 'a[href="/items/create"]',
          event: 'click',
        },
      },
      {
        id: 'Enter item name',
        text: t('demo.tours.modifyItem.steps.enterItemName'),
        attachTo: {
          element: '.modify-item-page > .item-data-container > label:nth-child(2)',
          on: 'bottom',
        },
        beforeShowPromise: async () => {
          await router.push('/items/create')
        },
        buttons: [buttons.value.finish, buttons.value.next],
      },
      {
        id: 'Select tags from list',
        text: t('demo.tours.modifyItem.steps.selectTags'),
        attachTo: {
          element: '.modify-item-page >.item-data-container > .input-item-tags > .tags',
          on: 'bottom',
        },
        buttons: [buttons.value.finish, buttons.value.next],
      },
      {
        id: 'Enter custom tags',
        text: t('demo.tours.modifyItem.steps.enterCustomTags'),
        attachTo: {
          element: '.modify-item-page >.item-data-container > .input-item-tags > label',
          on: 'top',
        },
        buttons: [buttons.value.finish, buttons.value.next],
      },
      {
        id: 'Select laundry symbols',
        text: t('demo.tours.modifyItem.steps.selectLaundrySymbols'),
        attachTo: {
          element: '.modify-item-page > .item-symbols-container',
          on: 'top',
        },
        buttons: [buttons.value.finish, buttons.value.next],
        scrollTo: true,
      },
      {
        id: 'Confirm creation',
        text: t('demo.tours.modifyItem.steps.confirmItemCreation'),
        attachTo: {
          element: '.modify-item-page > button',
          on: 'top',
        },
        when: {
          show() {
            document.querySelector('.modify-item-page > button')?.addEventListener('click', complete)
          },
        },
        buttons: [],
        scrollTo: true,
      },
    ]
  })

  if (!tour.steps.length) {
    tour.addSteps(steps.value)
  }

  function start() {
    demoStorage.value = {
      active: true,
      page: router.currentRoute.value.name,
      step: tour.getCurrentStep()?.id || null,
    }
    tour.start()
  }

  function skip() {
    tour.cancel()
    localStorage.removeItem('demo')
    router.replace({ name: router.currentRoute.value.name?.toString() })
  }

  function changeStep(direction: 'next' | 'back') {
    if (direction === 'next') {
      tour.next()
    } else {
      tour.back()
    }

    demoStorage.value.step = tour.getCurrentStep()?.id || null
  }

  function complete() {
    tour.complete()
    Notify.create({
      message: t('demo.notification.tourCompleted'),
      color: 'positive',
    })
    localStorage.removeItem('demo')
  }

  function showTourNotification() {
    notify({
      message: t('demo.notification.startTour'),
      color: 'brand',
      timeout: 10_000,
      actions: [
        {
          label: t('demo.notification.buttons.skip'),
          color: 'black',
          handler: skip,
        },
        {
          label: t('demo.notification.buttons.start'),
          color: 'black',
          handler: start,
        },
      ],
    })
  }

  if (!pageWatcher) {
    pageWatcher = watch(router.currentRoute, (_, oldPath) => {
      if (previousPage.value && previousPage.value.name !== oldPath.name) {
        tour.cancel()
      }
      previousPage.value = oldPath
    })
  }

  return {
    showTourNotification,
  }
}
