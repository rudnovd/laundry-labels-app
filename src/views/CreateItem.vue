<template>
  <section class="create-item-page q-px-sm q-pt-sm">
    <q-form class="create-item-form" @submit="onSubmit" @reset="onReset">
      <template v-if="step === 1">
        <q-select
          v-model="item.type"
          filled
          :options="options"
          label="Type *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          v-model="item.name"
          filled
          label="Name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <section class="color-picker-container">
          <q-color
            v-model="item.color"
            no-header
            no-footer
            format-model="rgb"
            default-view="palette"
            :palette="standartColors"
            @change="(value) => (item.color = value)"
          />

          <div class="selected-color" :style="{ backgroundColor: item.color }" />
        </section>
      </template>

      <template v-if="step === 2">
        <section class="washing-icons-container">
          <div
            v-for="icon in icons"
            :key="icon.laundryIcon.code"
            v-ripple
            class="icon-chip"
            :class="{ selected: isIconSelected(icon) }"
            @click="selectIcon(icon)"
          >
            <q-icon :name="icon.laundryIcon.path" />
            <span>{{ icon.name }}</span>
          </div>
        </section>
      </template>

      <q-btn
        color="primary"
        class="full-width"
        :icon-right="step === 1 ? 'arrow_right_alt' : ''"
        @click="step === 1 ? step++ : createItem"
      >
        {{ step === 1 ? 'Next step' : 'Add' }}
      </q-btn>
    </q-form>
  </section>
</template>

<script lang="ts">
import { laundryIcon } from '@/interfaces/laundryIcon'
import { defineComponent, reactive, ref } from '@vue/runtime-core'

export default defineComponent({
  name: 'CreateItem',
  setup() {
    const step = ref(1)

    const item = reactive({
      name: null,
      type: null,
      icons: [] as Array<string>,
    })

    const options = [
      {
        label: 'T-shirts',
        value: 'T_SHIRTS',
      },
      {
        label: 'Shorts',
        value: 'SHORTS',
      },
      {
        label: 'Coat',
        value: 'COAT',
      },
      {
        label: 'Suit',
        value: 'SUIT',
      },
      {
        label: 'Sweater',
        value: 'SWEATER',
      },
      {
        label: 'Jeans',
        value: 'JEANS',
      },
    ]

    const standartColors = ['#019A9D', '#D9B801', '#E8045A', '#B2028A', '#2A0449', '#019A9D']

    const icons: Array<laundryIcon> = [
      {
        code: 'BLEACHING',
        icon: 'app:laundry-icon-bleaching',
        group: {
          code: 'BLEACHING',
          value: 'Bleaching',
        },
        text: 'Bleaching allowed',
      },
      // {
      //   laundryIcon: {
      //     code: 'IRONING',
      //     path: 'app:laundry-icon-iron',
      //   },
      //   name: 'Ironing',
      //   group: {
      //     code: 'Ironing',
      //   },
      // },
      // {
      //   laundryIcon: {
      //     code: 'WASHING_90_DEG',
      //     path: 'app:laundry-icon-washing-90deg',
      //   },
      //   name: 'Washing 90 degrees',
      //   group: {
      //     code: 'Washing',
      //   },
      // },
    ]

    const selectIcon = (icon: string) => {
      item.icons.indexOf(icon) !== -1 ? item.icons.splice(item.icons.indexOf(icon), 1) : item.icons.push(icon)
    }

    const isIconSelected = (icon: string) => {
      return item.icons.indexOf(icon) !== -1
    }

    return {
      step,
      item,
      options,
      standartColors,
      icons,

      selectIcon,
      isIconSelected,
    }
  },
})
</script>

<style lang="scss" scoped>
.create-item-form {
  display: grid;
  gap: 1.5rem;
}

.color-picker-container {
  display: grid;
  gap: 4px;

  .selected-color {
    height: 24px;
    border-radius: 4px;
  }
}

.washing-icons-container {
  display: grid;
  // grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 5.625rem;
  gap: 1rem;
  // grid-template-rows: repeat(auto, 64px);
  // grid-auto-flow: row;
}

.icon-chip {
  display: grid;
  position: relative;
  padding: 0.25rem;
  grid-template-columns: 64px auto;
  gap: 0.5rem;
  align-items: center;
  border: 1px solid $grey-4;
  border-radius: 8px;

  & img {
    font-size: 4rem;
  }

  & span {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    overflow: hidden;
  }

  &.selected {
    background-color: rgba($grey-6, 0.3);
  }
}

.icon-chip-text {
  font-size: 0.5rem;
}
</style>
