import type {
  PropType,
  UniNode,
} from '@uni-component/core'
import {
  classNames,
  Fragment,
  h,
  uni2Platform,
  uniComponent,
  useRef,
} from '@uni-component/core'

// Styles
import './VFileInput.sass'

// Components
import { filterFieldProps, makeVFieldProps } from '@/components/VField/VField'
import { VChip } from '@/components/VChip'
import { CounterRender, VCounter } from '@/components/VCounter'
import { VField } from '@/components/VField'

// Composables
import { useLocale } from '@/composables/locale'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, ref } from '@uni-store/core'
import { filterInputAttrs, humanReadableFileSize, wrapInArray } from '@/util'

import { filterInputProps, makeVInputProps, VInput } from '@/components/VInput/VInput'

const UniVFileInput = uniComponent('v-file-input', {
  chips: Boolean,
  counter: Boolean,
  counterSizeString: {
    type: String,
    default: '$vuetify.fileInput.counterSize',
  },
  counterString: {
    type: String,
    default: '$vuetify.fileInput.counter',
  },
  multiple: Boolean,
  showSize: {
    type: [Boolean, Number] as PropType<boolean | 1000 | 1024>,
    default: false,
    validator: (v: boolean | number) => {
      return (
        typeof v === 'boolean' ||
        [1000, 1024].includes(v)
      )
    },
  },

  ...makeVInputProps(),

  prependIcon: {
    type: String,
    default: '$file',
  },
  modelValue: {
    type: Array as PropType<File[] | undefined>,
    default: () => ([]),
    validator: (val: any) => {
      return wrapInArray(val).every(v => v != null && typeof v === 'object')
    },
  },

  ...makeVFieldProps({ clearable: true }),

  'onUpdate:modelValue': Function as PropType<(files: File[]) => void>,

  counterRender: CounterRender,
  selectionRender: Function as PropType<(scope: {
    fileNames: string[]
    totalBytes: number
    totalBytesReadable: string
  }) => UniNode | undefined>,
}, (_, props, context) => {
  const { t } = useLocale()
  const model = useProxiedModel(props, context, 'modelValue')

  const internalDirty = ref(false)
  const isDirty = computed(() => {
    return internalDirty.value || !!model.value?.length
  })
  const setDirty = (val: boolean) => {
    internalDirty.value = val
  }

  const base = computed(() => typeof props.showSize !== 'boolean' ? props.showSize : undefined)
  const totalBytes = computed(() => (model.value ?? []).reduce((bytes, { size = 0 }) => bytes + size, 0))
  const totalBytesReadable = computed(() => humanReadableFileSize(totalBytes.value, base.value))

  const fileNames = computed(() => (model.value ?? []).map(file => {
    const { name = '', size = 0 } = file

    return !props.showSize
      ? name
      : `${name} (${humanReadableFileSize(size, base.value)})`
  }))

  const counterValue = computed(() => {
    const fileCount = model.value?.length ?? 0
    if (props.showSize) return t(props.counterSizeString, fileCount, totalBytesReadable.value)
    else return t(props.counterString, fileCount)
  })

  const inputRef = ref<HTMLInputElement>()
  const setInputRef = useRef(inputRef)
  function focus () {
    inputRef.value?.focus()
  }
  function blur () {
    inputRef.value?.blur()
  }
  function click () {
    inputRef.value?.click()
  }
  function clear (e?: Event) {
    e?.stopPropagation()

    model.value = []

    if (inputRef?.value) {
      inputRef.value.value = ''
    }
  }

  const onFileClick = (e: MouseEvent) => {
    e.stopPropagation()
  }
  const onFileChange = (e: Event, isActive: boolean) => {
    if (!e.target) return

    const target = e.target as HTMLInputElement
    model.value = [...target.files ?? []]

    if (!isActive) inputRef.value?.focus()
  }

  return {
    internalDirty,
    counterValue,
    fileNames,
    totalBytes,
    totalBytesReadable,
    isDirty,
    setDirty,
    setInputRef,
    onFileClick,
    onFileChange,
    focus,
    blur,
    click,
    clear,
  }
})

export const VFileInput = uni2Platform(UniVFileInput, (props, state, { attrs }) => {
  const {
    rootClass,
    counterValue,
    fileNames,
    totalBytes,
    totalBytesReadable,
    isDirty,
    setDirty,
    setInputRef,
    onFileClick,
    onFileChange,
    click,
    clear,
  } = state
  const hasCounter = !!(props.counterRender || props.counter || counterValue)
  const [rootAttrs, inputAttrs] = filterInputAttrs(attrs)
  const [inputProps] = filterInputProps(props)
  const [fieldProps, _] = filterFieldProps(props)

  return (
    <VInput
      { ...rootAttrs }
      class={classNames(rootClass, rootAttrs.class as string)}
      { ...inputProps }

      defaultRender={() => (
        <VField
          active={ isDirty }
          prepend-icon={ props.prependIcon }
          onUpdate:active={ setDirty }
          onClick:control={ click }
          onClick:prepend-inner={ click }
          onClick:clear={ clear }
          { ...fieldProps }
          defaultRender={({ isActive, props: { class: fieldClass, ...slotProps } }) => (
            <>
              <input
                ref={ setInputRef }
                type="file"
                disabled={ props.disabled }
                multiple={ props.multiple }
                onClick={ onFileClick }
                onChange={ e => onFileChange(e, isActive) }
                { ...slotProps }
                { ...inputAttrs }
              />

              { isDirty && (
                <div class={ fieldClass as string }>
                  { props.selectionRender ? props.selectionRender({
                    fileNames,
                    totalBytes,
                    totalBytesReadable,
                  })
                  : props.chips ? fileNames.map(text => (
                    <VChip
                      key={ text }
                      size="small"
                      color={ props.color }
                    >{ text }</VChip>
                  ))
                  : fileNames.join(', ') }
                </div>
              ) }
            </>
          )}
        />
      )}
      detailsRender={
        hasCounter ? () => (
          <>
            <span />

            <VCounter
              active
              value={ counterValue }
              defaultRender={props.counterRender}
            />
          </>
        ) : undefined
      }
    />
  )
})
