import Datasources from '@/pages/js/datasources.js'
import { shallow } from 'vue-test-utils'
import axios from 'axios'

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({})),
  put: jest.fn(() => Promise.resolve({})),
  post: jest.fn(() => Promise.resolve({}))
}))

describe('Datasources.vue', () => {
  let component

  beforeEach(() => {
    component = shallow(Datasources)
  })
  it('should called Datasources', function () {
    const wrapper = shallow(Datasources)
    expect(wrapper.name()).toEqual('Datasources')
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
  it('method#search-Item', () => {
    component.vm.searchItem()
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
  it('method#search_item_keyNotBlank', () => {
    component.vm.key = "abc"
    component.vm.searchItem()
  })
  it('method#fetch-Division', () => {
    component.vm.fetchDivision()
    expect(axios.get).toHaveBeenCalled()
  })
  it('method#respFetchDivision_withParam', () => {
    const mockResponse = {
      data: {
        data: {
          content: []
        }
      }
    }
    component.vm.respFetchDivision(mockResponse)
  })
  it('method#respFetchDivision', function () {
    component.vm.respFetchDivision
  });
  it('method#fetch-item', () => {
    component.vm.fetchItem()
    expect(axios.get).toHaveBeenCalled()
  })
  it('method#respFetchItem_withParam', () => {
    const mockResponse = {
      data: {
        data: {
          content: [],
          first: [],
          last: [],
          totalPages: 0,
          number: []
        }
      }
    }
    component.vm.respFetchItem(mockResponse)
  })
  it('method#respFetchItem_withParam_totalPages_isNot_zero', () => {
    const mockResponse = {
      data: {
        data: {
          content: [],
          first: [],
          last: [],
          totalPages: 2,
          number: []
        }
      }
    }
    component.vm.respFetchItem(mockResponse)
  })
  it('method#edit-item', () => {
    let items = {
      id: 1,
      name: 'cobabrenda',
      hostname: 'localhost',
      port: '5433',
      username: 'postgre',
      password: 'abcdefghijk',
      status: 'true',
      division: 'coba'
    }
    component.vm.editItem(items)
  })
  it('method#on-delete-item', () => {
    let items = {
      id: 1,
      name: 'cobabrenda',
      hostname: 'localhost',
      port: '5433',
      username: 'postgre',
      password: 'abcdefghijk',
      status: 'true',
      division: 'coba'
    }
    component.vm.onDeleteItem(items)
    expect(axios.put).toHaveBeenCalled()
  })
  it('method#off-delete-item', () => {
    let items = {
        id: 1,
        name: 'cobabrenda',
        hostname: 'localhost',
        port: '5433',
        username: 'postgre',
        password: 'abcdefghijk',
        status: 'true',
        division: 'coba'
    }
    component.vm.offDeleteItem(items)
    expect(axios.put).toHaveBeenCalled()
  })
  it('method#close_Valid_Success', () => {
    component.vm.close()
  })
  it('method#save', () => {
    component.vm.save()
    expect(axios.post).toHaveBeenCalled()
  })
  it('method#save_editedItemId_isnot_blank', function () {
    component.vm.editedItem.id = "123"
    component.vm.save()
    expect(axios.put).toHaveBeenCalled()
  })
  // it('should check hostnamerules is less than or equal 25', function () {
  //   let mockRule = {
  //     v: 'abc'
  //   }
  //   component.vm.hostnameRules.v = mockRule.v
  //   expect(component.vm.hostnameRules.v).toHaveLength(3)
  //   expect(component.vm.hostnameRules.v).toBe(true)
  // });
  // it('should check hostnamerules is greater than 25', function () {
  //   let mockRule = {
  //     v: 'abcdefghijklmnopqrstuvwxyz'
  //   }
  //   component.vm.hostnameRules.v = mockRule.v
  //   expect(component.vm.hostnameRules.v).not.toHaveLength(25)
  //   expect(component.vm.hostnameRules.v).toBe('Hostname must be less than 25 character')
  // });
})
