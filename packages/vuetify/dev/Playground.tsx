import { h, uniComponent, uni2Platform, classNames } from '@uni-component/core'
import { computed, ref } from '@uni-store/core'
import {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VContainer,
  VRow,
  VCol,
  VSpacer,
  VBtn,
  VBtnGroup,
  VBtnToggle,
  VIcon,
  VAlert,
  VAvatar,
  VBadge,
  VBanner,
  VBreadcrumbs,
  VCard,
  VCardText,
  VCardActions,
  VCheckbox,
  VChip,
  VCounter,
  VDefaultsProvider,
  VDialog,
  VDivider,
  VExpansionPanels,
  VExpansionPanel,
  VFileInput,
  VFooter,
  VForm,
  VHover,
  VImg,
  VInput,
  VItemGroup,
  VItem,
  VLayout,
  VList,
  VListItem,
  VMain,
  VNavigationDrawer,
  VPagination,
  VParallax,
  VProgressCircular,
  VProgressLinear,
  VRadioGroup,
  VRadio,
  VRangeSlider,
  VRating,
  VSheet,
  VSwitch,
  VSystemBar,
  VTable,
  VTextarea,
  VTextField,
  VTimeline,
  VTimelineItem,
  VTooltip,
  VThemeProvider,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo', () => {
  const btnGroupValue = ref('center')
  const onGroupChange = (v: any) => {
    btnGroupValue.value = v
  }

  const breadcrumbsItems = [
    {
      tag: 'a',
      text: 'Dashboard',
      disabled: false,
      href: 'breadcrumbs_dashboard',
    },
    {
      tag: 'a',
      text: 'Link 1',
      disabled: false,
      href: 'breadcrumbs_link_1',
    },
    {
      tag: 'a',
      text: 'Link 2',
      disabled: true,
      href: 'breadcrumbs_link_2',
    },
  ]

  const checkbox = ref(true)
  const setCheckbox = (val: boolean) => {
    checkbox.value = val
  }

  const chip = ref(true)
  const closeChip = () => {
    chip.value = false
  }

  const counterActive = ref(false)
  const toggleCounter = () => {
    counterActive.value = !counterActive.value
  }

  const defaults = computed(() => ({
    global: {
      elevation: 10,
    },
    VCard: {
      color: 'secondary',
    },
  }))

  const dialog = ref(false)
  const setDialog = (val = false) => {
    dialog.value = val
  }

  const navigationDrawerItems = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard' },
    { title: 'Photos', icon: 'mdi-image' },
    { title: 'About', icon: 'mdi-help-box' },
  ]

  const page = ref(1)
  const updatePage = (val: number) => {
    page.value = val
    console.log('cur page', val)
  }

  const radioGroup = ref(2)
  const updateRadioGroup = (v: number) => {
    radioGroup.value = v
  }

  const range = ref([30, 60])
  const updateRange = (v: [number, number]) => range.value = v

  const rating = ref(3)
  const updateRating = (v: number) => rating.value = v

  const switchVal = ref(false)
  const updateSwitchVal = (v: boolean) => switchVal.value = v

  const textarea = ref('The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through.')
  const updateTextarea = (v: string) => textarea.value = v

  const textField = ref('Preliminary report')
  const updateTextField = (v: string) => textField.value = v

  return {
    btnGroupValue,
    onGroupChange,

    breadcrumbsItems,

    checkbox,
    setCheckbox,

    chip,
    closeChip,

    counterActive,
    toggleCounter,

    defaults,

    dialog,
    setDialog,

    navigationDrawerItems,

    page,
    updatePage,

    radioGroup,
    updateRadioGroup,

    range,
    updateRange,

    rating,
    updateRating,

    switchVal,
    updateSwitchVal,

    textarea,
    updateTextarea,

    textField,
    updateTextField,
  }
}), (_, state) => {
  const {
    btnGroupValue,
    onGroupChange,

    breadcrumbsItems,

    checkbox,
    setCheckbox,

    chip,
    closeChip,

    counterActive,
    toggleCounter,

    defaults,

    dialog,
    setDialog,

    navigationDrawerItems,

    page,
    updatePage,

    radioGroup,
    updateRadioGroup,

    range,
    updateRange,

    rating,
    updateRating,

    switchVal,
    updateSwitchVal,

    textarea,
    updateTextarea,

    textField,
    updateTextField,
  } = state
  return (
    <VApp>
      <VContainer>
        <VBtnGroup>
          <VBtn>safdsdf</VBtn>
          <VBtn>ssdf</VBtn>
        </VBtnGroup>
        <div class='section-btn'>
          <VBtn block ripple={false}>outer</VBtn>
          <VBtn border>Text</VBtn>
          <VBtn icon='mdi-heart' color='primary'></VBtn>
        </div>
        <br></br>
        <div class='section-btn-toggle'>
          <VBtnToggle modelValue={btnGroupValue} onUpdate:modelValue={onGroupChange}>
            <VBtn value='left'>
              <VIcon>mdi-format-align-left</VIcon>
            </VBtn>

            <VBtn value='center'>
              <VIcon>mdi-format-align-center</VIcon>
            </VBtn>

            <VBtn value='right'>
              <VIcon>mdi-format-align-right</VIcon>
            </VBtn>

            <VBtn value='justify'>
              <VIcon>mdi-format-align-justify</VIcon>
            </VBtn>
          </VBtnToggle>
        </div>
        <div class='section-alert'>
          <VAlert
            border='end'
            borderColor='error'
            elevation='2'
            class='ma-2'
          >
            Fusce commodo aliquam arcu. Pellentesque posuere. Phasellus tempus. Donec posuere vulputate arcu.
          </VAlert>
          <VAlert
            density='compact'
            variant='outlined'
            type='error'
            class='ma-2'
          >
            I'm a dense alert with the <strong>outlined</strong> prop and a <strong>type</strong> of error
          </VAlert>
          <VAlert type='success'>
            I'm a success alert.
          </VAlert>

          <VAlert type='info'>
            I'm an info alert.
          </VAlert>

          <VAlert type='warning'>
            I'm a warning alert.
          </VAlert>

          <VAlert type='error'>
            I'm an error alert.
          </VAlert>
        </div>
        <div class='section-avatar'>
          <VAvatar color='primary' size='50'>VJ</VAvatar>
          <VAvatar color='primary' size='50'>
            <VIcon>
              mdi-account-circle
            </VIcon>
          </VAvatar>
          <VAvatar
            color='primary'
            size='50'
            image='https://cdn.vuetifyjs.com/images/john.jpg'
          ></VAvatar>
        </div>
        <div class='section-badge'>
          <VBadge
            bordered
            color='error'
            icon='mdi-lock'
          >
            <VBtn
              color='error'
              flat
            >
              Lock Account
            </VBtn>
          </VBadge>

          <VBadge
            bordered
            location='bottom-right'
            color='deep-purple-accent-4'
            dot
            offsetX='2'
            offsetY='4'
          >
            <VAvatar size='large'>
              <VImg src='https://cdn.vuetifyjs.com/images/lists/2.jpg'></VImg>
            </VAvatar>
          </VBadge>
          <VBadge
            bordered
            badgeRender={() => (
              <VAvatar>
                <VImg src='https://cdn.vuetifyjs.com/images/logos/v.png'></VImg>
              </VAvatar>
            )}
          >
            <VAvatar size='large'>
              <VImg src='https://cdn.vuetifyjs.com/images/john.png'></VImg>
            </VAvatar>
          </VBadge>
        </div>
        
        <div class='section-app-bar'>
          <VLayout>
            <VAppBar
              absolute
              color='#fcb69f'
              // dark
              // shrink-on-scroll
              // scrollTarget='#scrolling-techniques-2'
              image='https://picsum.photos/1920/1080?random'
              imageRender={({ src }) => (
                <VImg
                  src={src as string}
                  gradient='to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)'
                ></VImg>
              )}
            >
              <VAppBarNavIcon></VAppBarNavIcon>

              <VAppBarTitle>Title</VAppBarTitle>

              <VSpacer></VSpacer>

              <VBtn icon>
                <VIcon>mdi-magnify</VIcon>
              </VBtn>

              <VBtn icon>
                <VIcon>mdi-heart</VIcon>
              </VBtn>

              <VBtn icon>
                <VIcon>mdi-dots-vertical</VIcon>
              </VBtn>
            </VAppBar>
            <VMain>
              {/* <VSheet
                id='scrolling-techniques-2'
                class='overflow-y-auto'
                maxHeight='600'
              >
                <VContainer style='height: 1000px;'></VContainer>
              </VSheet> */}
            </VMain>
          </VLayout>
        </div>
        <div class='section-banner'>
          <VBanner
            lines='one'
            sticky
            actionsRender={() => (
              <VBtn color='deep-purple-accent-4'>
                Get Online
              </VBtn>
            )}
          >
            We can't save your edits while you are in offline mode.
          </VBanner>
        </div>
        <div class='section-breadcrumbs'>
          <VBreadcrumbs tag='div' items={breadcrumbsItems} itemRender={(scope) => scope.props.text.toUpperCase()}></VBreadcrumbs>
        </div>
        <div class='section-checkbox'>
          <VCheckbox
            modelValue={checkbox}
            onUpdate:modelValue={setCheckbox}
            label={`Checkbox: ${checkbox.toString()}`}
          ></VCheckbox>
        </div>
        <div class='section-chip'>
          {chip && <VChip
            class='ma-2'
            closable
            onClick:close={closeChip}
          >
            Closable
          </VChip>
          }
          <VChip
            class='ma-2'
            link
          >
            Default
          </VChip>

          <VChip
            class='ma-2'
            color='primary'
          >
            Primary
          </VChip>

          <VChip
            class='ma-2'
            color='secondary'
          >
            Secondary
          </VChip>

          <VChip
            class='ma-2'
            color='red'
            textColor='white'
          >
            Red Chip
          </VChip>

          <VChip
            class='ma-2'
            color='green'
            textColor='white'
          >
            Green Chip
          </VChip>
        </div>
        <div class='section-counter'>
          <VBtn onClick={toggleCounter}>Toggle counter</VBtn>
          <VCounter active={counterActive} style={{position: 'absolute'}}></VCounter>
        </div>
        <div class='section-default-provider'>
          <VCard title='Title' subtitle='Subtitle' class='ma-10'></VCard>
          <VDefaultsProvider defaults={defaults}>
            <VCard title='Title' subtitle='Subtitle' class='ma-10'></VCard>
          </VDefaultsProvider>
        </div>
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
        <div class='section-divider'>
          <p>before</p>
          <VDivider />
          <p>after</p>
        </div>
        <div class='section-expansion-panels'>
          <VExpansionPanels>
            <VExpansionPanel title='Item' text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'></VExpansionPanel>
            <VExpansionPanel title='Item2' text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'></VExpansionPanel>
          </VExpansionPanels>
        </div>
        <div class='section-file-input'>
          <VFileInput {...{accept: 'image/*'}} label='File input'></VFileInput>
          <VFileInput
            chips
            multiple
            label='File input w/ chips'
          ></VFileInput>
        </div>
        <div class='section-footer'>
          <VFooter class='d-flex flex-column'>
            <div class='bg-teal d-flex w-100 align-center px-4'>
              <strong class='text-white'>Get connected with us on social networks!</strong>

              <VSpacer></VSpacer>

              <VBtn
                class='mx-4 text-white'
                icon='mdi-facebook'
                variant='plain'
                size='small'
              ></VBtn>
              <VBtn
                class='mx-4 text-white'
                icon='mdi-twitter'
                variant='plain'
                size='small'
              ></VBtn>
            </div>

            <div class='px-4 py-2 bg-black text-white text-center w-100'>
              {new Date().getFullYear() } — <strong>Vuetify</strong>
            </div>
          </VFooter>
        </div>
        <div class='section-form'>
          <VForm>
            xx
          </VForm>
        </div>
        <div class='section-grid'>
          <VContainer class='grey lighten-5'>
            <VRow noGutters>
              <VCol cols='12' sm='6'>
                <VCard class='pa-2' variant='outlined'>
                  One of three columns
                </VCard>
              </VCol>
              <VCol cols='12' sm='6'>
                <VCard class='pa-2'>
                  One of three columns
                </VCard>
              </VCol>
            </VRow>
          </VContainer>
        </div>
        <div class='section-hover'>
          <VHover
            openDelay={200}
            defaultRender={({hover, props}) => (
              <VCard
                elevation={hover ? 16 : 2}
                class={`mx-auto${hover && ' on-hover' || ''}`}
                height='150'
                maxWidth='150'
                {...props}
              >
                <VCardText class='font-weight-medium mt-12 text-center text-subtitle-1'>
                  Open Delay (Mouse enter)
                </VCardText>
              </VCard>
            )}
          />
        </div>
        <div class='section-input'>
          <VInput
            messages={['Messages']}
            appendIcon='mdi-close'
            prependIcon='mdi-phone'
          >
            Default Slot
          </VInput>
        </div>
        <div class='section-item-group'>
          <VItemGroup selectedClass='bg-primary'>
            <VContainer>
              <VRow>
                <VCol>
                  <VItem
                    defaultRender={({ isSelected, selectedClass, toggle }) => (
                      <VCard
                        class={classNames(['d-flex', 'align-center', selectedClass])}
                        height='200'
                        onClick={toggle}
                      >
                        <div class='text-h3 flex-grow-1 text-center'>
                          { isSelected ? 'Selected' : 'Click Me!' }
                        </div>
                      </VCard>
                    )}
                  />
                </VCol>
                <VCol>
                  <VItem
                    defaultRender={({ isSelected, selectedClass, toggle }) => (
                      <VCard
                        class={classNames(['d-flex', 'align-center', selectedClass])}
                        height='200'
                        ripple
                        onClick={toggle}
                      >
                        <div class='text-h3 flex-grow-1 text-center'>
                          { isSelected ? 'Selected' : 'Click Me!' }
                        </div>
                      </VCard>
                    )}
                  />
                </VCol>
              </VRow>
            </VContainer>
          </VItemGroup>
        </div>
        <div class='section-navigation-drawer'>
          <VCard
            height='400'
            width='556'
            class='mx-auto'
          >
            <VNavigationDrawer permanent>
              <VListItem title='Application' subtitle='subtext' />

              <VDivider />

              <VList
                density='compact'
                nav
              >
                {navigationDrawerItems.map((item) => {
                  return (
                    <VListItem
                      key={item.title}
                      link
                      prependIcon={item.icon}
                      title={item.title}
                    />
                  )
                })}
              </VList>
            </VNavigationDrawer>
          </VCard>
        </div>
        <div class='section-pagination'>
          <VPagination
            modelValue={page}
            onUpdate:modelValue={updatePage}
            length={6}
          />
        </div>
        <div class='section-parallax'>
          <VParallax src='https://cdn.vuetifyjs.com/images/parallax/material.jpg' />
        </div>
        <div class='section-progress-circular'>
          <VProgressCircular
            size='50'
            color='primary'
            indeterminate
          ></VProgressCircular>
        </div>
        <div class='section-progress-linear'>
          <VProgressLinear
            indeterminate
            color='teal'
          ></VProgressLinear>
        </div>
        <div class='section-radio'>
          <VRadioGroup modelValue={radioGroup} onUpdate:modelValue={updateRadioGroup}>
            {[1, 2, 3].map((n) => (
              <VRadio
                key={String(n)}
                label={`Radio ${n}`}
                value={n}
              />
            ))}
          </VRadioGroup>
        </div>
        <div class='section-range-slider'>
          <VRangeSlider
            modelValue={range}
            onUpdate:modelValue={updateRange}
            label='Slider'
          />
          {range}
        </div>
        <div class='section-rating text-center'>
          <VRating
            modelValue={rating}
            onUpdate:modelValue={updateRating}
            clearable
            hover
            itemLabels={['sad', '', '', '', 'happy']}
            itemLabelPosition='bottom'
            size='x-large'
          />
          {rating}
        </div>
        <div class='section-sheet'>
          <VSheet
            class='pa-12'
            color='grey lighten-3'
          >
            <VSheet
              class='mx-auto'
              height='100'
              width='100'
              elevation='10'
              rounded
            ></VSheet>
          </VSheet>
        </div>
        <div class='section-switch'>
          <VSwitch
            modelValue={switchVal}
            onUpdate:modelValue={updateSwitchVal}
            label={`Switch val: ${switchVal.toString()}`}
            color='red'
            hideDetails
          ></VSwitch>
        </div>
        <div class='section-system-bar'>
          <VSystemBar>system</VSystemBar>
        </div>
        <div class='section-table'>
          <VTable>
            <thead>
              <tr>
                <th class='text-left'>
                  Name
                </th>
                <th class='text-left'>
                  Index
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AA</td>
                <td>1</td>
              </tr>
              <tr>
                <td>BB</td>
                <td>2</td>
              </tr>
            </tbody>
          </VTable>
        </div>
        <div class='section-textarea'>
          <VTextarea
            name='input-7-1'
            label='Default style'
            modelValue={textarea}
            onUpdate:modelValue={updateTextarea}
            hint='Hint text'
          ></VTextarea>
        </div>
        <div class='section-text-field'>
          <VTextField
            modelValue={textField}
            onUpdate:modelValue={updateTextField}
            rules={[v => v.length <= 25 || 'Max 25 characters']}
            counter='25'
            hint='This field uses counter prop'
            label='Regular'
            clearable
          />
        </div>
        <div class='section-timeline'>
          <VCard
            class='mx-auto'
            max-width='400'
          >
            <VCardText class='py-0'>
              <VTimeline side='before'>
                <VTimelineItem
                  dotColor='pink'
                  size='small'
                >
                  <VRow class='pt-1'>
                    <VCol cols='3'>
                      <strong>5pm</strong>
                    </VCol>
                    <VCol>
                      <strong>New Icon</strong>
                      <div class='text-caption'>
                        Mobile App
                      </div>
                    </VCol>
                  </VRow>
                </VTimelineItem>

                <VTimelineItem
                  dotColor='teal lighten-3'
                  size='small'
                >
                  <VRow class='pt-1'>
                    <VCol cols='3'>
                      <strong>3-4pm</strong>
                    </VCol>
                    <VCol>
                      <strong>Design Stand Up</strong>
                      <div class='text-caption mb-2'>
                        Hangouts
                      </div>
                      <VAvatar>
                        <VImg
                          src='https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown'
                        ></VImg>
                      </VAvatar>
                      <VAvatar>
                        <VImg
                          src='https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Tanned'
                        ></VImg>
                      </VAvatar>
                      <VAvatar>
                        <VImg
                          src='https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale'
                        ></VImg>
                      </VAvatar>
                    </VCol>
                  </VRow>
                </VTimelineItem>

                <VTimelineItem
                  dotColor='pink'
                  size='small'
                >
                  <VRow class='pt-1'>
                    <VCol cols='3'>
                      <strong>12pm</strong>
                    </VCol>
                    <VCol>
                      <strong>Lunch break</strong>
                    </VCol>
                  </VRow>
                </VTimelineItem>

                <VTimelineItem
                  dotColor='teal lighten-3'
                  size='small'
                >
                  <VRow class='pt-1'>
                    <VCol cols='3'>
                      <strong>9-11am</strong>
                    </VCol>
                    <VCol>
                      <strong>Finish Home Screen</strong>
                      <div class='text-caption'>
                        Web App
                      </div>
                    </VCol>
                  </VRow>
                </VTimelineItem>
              </VTimeline>
            </VCardText>
          </VCard>
        </div>
        <div class='section-tooltip' style={{position: 'relative'}}>
          <VTooltip activatorRender={({ props }) => (
            <VBtn
              color='primary'
              {...props}
            >
              Button
            </VBtn>
          )}>
            <span>Tooltip</span>
          </VTooltip>
        </div>
        <div class='section-theme-provider'>
          <VThemeProvider theme='dark' withBackground class='pa-10'>
            <VCard title='Title' subtitle='Subtitle' />
          </VThemeProvider>
        </div>
      </VContainer>
    </VApp>
  )
})
