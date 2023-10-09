import { h, uniComponent, uni2Platform } from '@uni-component/core'
import { ref } from '@uni-store/core'
import {
  VDialog,
  VBtn,
  VCard,
  VCardText,
  VCardActions,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-dialog', () => {
  const dialog = ref(false)
  const setDialog = (val = false) => {
    dialog.value = val
  }

  return {
    dialog,
    setDialog,
  }
}), (_, state) => {
  const {
    dialog,
    setDialog,
  } = state
  return (
    <div class='section-dialog'>
      <div class='text-center'>
        <VDialog
          modelValue={dialog}
          onUpdate:modelValue={setDialog}
          activatorRender={({ props }) => (
            <VBtn
              color='primary'
              {...props}
            >
              Open Dialog
            </VBtn>
          )}
        >
          <VCard>
            <VCardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </VCardText>
            <VCardActions>
              <VBtn color='primary' block onClick={() => setDialog()}>Close Dialog</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </div>
    </div>
  )
})
