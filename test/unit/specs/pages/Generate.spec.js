import Generate from '@/pages/js/generate.js'
import { shallow } from 'vue-test-utils'
import axios from 'axios'

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({})),
  post: jest.fn(() => Promise.resolve({}))
}))

describe('Generate.vue', () => {
  let component

  beforeEach(() => {
    component = shallow(Generate)
  })
  it('should called Report', function () {
    const wrapper = shallow(Generate)
    expect(wrapper.name()).toEqual('Report')
  });
  it('form title return = GENERATING..', () => {
    component.vm.formTitle
    expect(component.vm.formTitle).toBe('GENERATING..')
  })
  // it('edited index > -1, form title is = GENERATING..', () => {
  //   component.vm.formTitle
  //   component.setData({ editedIndex: 0 })
  //   expect(component.vm.formTitle).toBe('GENERATING..')
  // })
  it('method#prev_Button', () => {
    component.vm.prevButton()
  })
  it('method#next_Button', () => {
    component.vm.nextButton()
  })
  it('method#search_Item', () => {
    component.vm.searchItem()
  })
  it('method#search_item_keyNotBlank', () => {
    component.vm.key = "abc"
    component.vm.searchItem()
    // expect(axios.get("abcd")).toHaveBeenCalled()
  })
  it('method#respSearchItem', () => {
    component.vm.respSearchItem
    expect(axios.get).toHaveBeenCalled()
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
      id: null,
      report: null,
      values: null
    }
    component.vm.editItem(items)
  })
  it('method#description_Dialog', () => {
    let items = {
      id: null,
      report: null,
      values: null
    }
    // component.vm.editedIndex = 1
    // component.vm.editedItem = items
    component.vm.description(items)
  })
  it('method#close_Valid_Success', () => {
    component.vm.close()
  })
  it('method#save_Or_Update_Item', function () {
    component.vm.save()
  })
  it('method#save_new_Item', function () {
    component.vm.save()
    expect(axios.post).toHaveBeenCalled()
  })
  it('method#formatDate', function () {
    let items = {
      id: null,
      report: null,
      values: null
    }
    component.vm.editItem(items)
  });
})
