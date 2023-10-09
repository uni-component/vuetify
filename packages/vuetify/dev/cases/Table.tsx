import { h, uniComponent, uni2Platform } from '@uni-component/core'
import {
  VTable,
} from 'vuetify'

export default uni2Platform(uniComponent('pg-demo-table', () => {
  return {}
}), (_, state) => {
  return (
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
  )
})
