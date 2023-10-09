import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VApp,
  VContainer,
} from 'vuetify'
import Alert from './cases/Alert'
import AppBar from './cases/AppBar'
import Avatar from './cases/Avatar'
import Badge from './cases/Badge'
import Banner from './cases/Banner'
import Breadcrumbs from './cases/Breadcrumbs'
import BtnGroup from './cases/BtnGroup'
import BtnToggle from './cases/BtnToggle'
import Checkbox from './cases/Checkbox'
import Chip from './cases/Chip'
import Counter from './cases/Counter'
import DefaultsProvider from './cases/DefaultsProvider'
import Dialog from './cases/Dialog'
import Divider from './cases/Divider'
import ExpansionPanels from './cases/ExpansionPanels'
import FileInput from './cases/FileInput'
import Footer from './cases/Footer'
import Form from './cases/Form'
import Grid from './cases/Grid'
import Hover from './cases/Hover'
import Input from './cases/Input'
import ItemGroup from './cases/ItemGroup'
import NavigationDrawer from './cases/NavigationDrawer'
import Pagination from './cases/Pagination'
import Parallax from './cases/Parallax'
import ProgressCircular from './cases/ProgressCircular'
import ProgressLinear from './cases/ProgressLinear'
import Radio from './cases/Radio'
import RangeSlider from './cases/RangeSlider'
import Rating from './cases/Rating'
import Sheet from './cases/Sheet'
import Switch from './cases/Switch'
import SystemBar from './cases/SystemBar'
import Table from './cases/Table'
import Textarea from './cases/Textarea'
import TextField from './cases/TextField'
import ThemeProvider from './cases/ThemeProvider'
import Timeline from './cases/Timeline'
import Tooltip from './cases/Tooltip'

export default uni2Platform(uniComponent('pg-demo', () => {
  return {}
}), () => {
  return (
    <VApp>
      <VContainer>
        <BtnGroup />
        <br />
        <BtnToggle />
        <Alert />
        <Avatar />
        <Badge />
        <AppBar />
        <Banner />
        <Breadcrumbs />
        <Checkbox />
        <Chip />
        <Counter />
        <DefaultsProvider />
        <Dialog />
        <Divider />
        <ExpansionPanels />
        <FileInput />
        <Footer />
        <Form />
        <Grid />
        <Hover />
        <Input />
        <ItemGroup />
        <NavigationDrawer />
        <Pagination />
        <Parallax />
        <ProgressCircular />
        <ProgressLinear />
        <Radio />
        <RangeSlider />
        <Rating />
        <Sheet />
        <Switch />
        <SystemBar />
        <Table />
        <Textarea />
        <TextField />
        <Timeline />
        <Tooltip />
        <ThemeProvider />
      </VContainer>
    </VApp>
  )
})
