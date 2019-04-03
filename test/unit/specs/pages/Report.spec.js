import Report from '@/pages/js/report.js'
import { shallow } from 'vue-test-utils'
// import alert from 'sweetalert2'
import axios from 'axios'

// jest.mock('sweetalert2', () => {
//   return {
//     alert: () => {
//       module.exports = jest.fn();
//     }
//   }
// })
// jest.mock('axios')
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({})),
  put: jest.fn(() => Promise.resolve({})),
  post: jest.fn(() => Promise.resolve({}))
}))

describe('Report.vue', () => {
  let component

  beforeEach(() => {
    component = shallow(Report)
  })
  it('should called Report', function () {
    const wrapper = shallow(Report)
    expect(wrapper.name()).toEqual('Report')
  });
  it('edited index = -1, form title is = create', () => {
    component.vm.formTitle
    component.setData({ editedIndex: -1 })
    expect(component.vm.formTitle).toBe('Create')
  })
  it('edited index > -1, form title is = Edit', () => {
    component.vm.formTitle
    component.setData({ editedIndex: 0 })
    expect(component.vm.formTitle).toBe('Edit')
  })
  it('method#prev_Button', () => {
    component.vm.prevButton()
  })
  it('method#next_Button', () => {
    component.vm.nextButton()
  })
  it('method#add_Row_Param', () => {
    component.vm.addRow()
  })
  it('method#delete_Row_Param', () => {
    component.vm.deleteRow()
  })
  it('method#fetch_Datasource', () => {
    // const mockResponse = {
    //   data: {
    //     data: {
    //       content: []
    //     }
    //   }
    // }
    // component.vm.fetchDatasource().then(component.vm.respFetchDatasource())
    // axios.get.mockResolvedValue(mockResponse)
    component.vm.fetchDatasource()
    expect(axios.get).toHaveBeenCalled()
  })
  it('method#respFetchDatasource', () => {
    const mockResponse = {
      data: {
        data: {
          content: []
        }
      }
    }
    component.vm.respFetchDatasource(mockResponse)
  })
  it('method#fetch_Division', () => {
    component.vm.fetchDivision()
    expect(axios.get).toHaveBeenCalled()
  })
  it('method#respFetchDivision', () => {
    const mockResponse = {
      data: {
        data: {
          content: []
        }
      }
    }
    component.vm.respFetchDivision(mockResponse)
  })
  it('method#search_Item', () => {
    component.vm.searchItem()
    expect(axios.get).toHaveBeenCalled()
  })
  it('method#search_item_keyNotBlank', () => {
    component.vm.key = "abc"
    component.vm.searchItem()
    // expect(axios.get("abcd")).toHaveBeenCalled()
  })
  it('method#respSearchItem', () => {
    component.vm.respSearchItem
  })
  it('method#respSearchItem_withParam', () => {
    const mockResponse = {
      data: {
        data: {
          content: [],
          first: [],
          last: [],
          totalPages: 0
        }
      }
    }
    component.vm.respSearchItem(mockResponse)
  })
  it('method#respSearchItem_withParam_andPageNumber_isNot_zero', () => {
    const mockResponse = {
      data: {
        data: {
          content: [],
          first: [],
          last: [],
          totalPages: 2
        }
      }
    }
    component.vm.respSearchItem(mockResponse)
  })
  it('method#close_Valid_Success', () => {
    component.vm.close()
  })
  it('method#fetch_Item', () => {
    component.vm.fetchItem()
    expect(axios.get).toHaveBeenCalled()
  })
  it('method#respFetchItem', () => {
    component.vm.respFetchItem
  })
  it('method#respFetchItem_withParam', () => {
    const mockResponse = {
      data: {
        data: {
          content: [],
          first: [],
          last: [],
          totalPages: 0
        }
      }
    }
    component.vm.respFetchItem(mockResponse)
  })
  it('method#respFetchItem_withParam_andPageNumber_isNot_Zero', function () {
    const mockResponse = {
      data: {
        data: {
          content: [],
          first: [],
          last: [],
          totalPages: 2
        }
      }
    }
    component.vm.respFetchItem(mockResponse)
  });
  it('method#edit_Item_Dialog', () => {
    let items = {
      id: 1,
      title: 'coba',
      description: 'coba',
      sql: 'select*from coba',
      datasource: 'coba',
      division: 'coba',
      parameters: 'coba'
    }
    component.vm.editItem(items)
  })
  it('method#off_Delete_Item_Status', () => {
    let items = {
      id: 1,
      title: 'coba',
      description: 'coba',
      sql: 'select*from coba',
      datasource: 'coba',
      division: 'coba',
      parameters: 'coba'
    }
    component.vm.offDeleteItem(items)
    expect(axios.put).toHaveBeenCalled()
  })
  it('method#on_Delete_Item_Status', () => {
    let items = {
      id: 1,
      title: 'coba',
      description: 'coba',
      sql: 'select*from coba',
      datasource: 'coba',
      division: 'coba',
      parameters: 'coba'
    }
    component.vm.onDeleteItem(items)
    expect(axios.put).toHaveBeenCalled()
  })
  it('method#save_new_Item', function () {
    component.vm.save()
    expect(axios.post).toHaveBeenCalled()
  })
  it('method#save_editedItemId_isnot_blank_alias_updateItem', function () {
    component.vm.editedItem.id = "123"
    component.vm.save()
    expect(axios.put).toHaveBeenCalled()
  });
})
