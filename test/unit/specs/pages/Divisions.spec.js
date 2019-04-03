import Divisions from '@/pages/js/divisions.js'
import { shallow } from 'vue-test-utils'
import axios from 'axios'

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({})),
  put: jest.fn(() => Promise.resolve({})),
  post: jest.fn(() => Promise.resolve({}))
}))

describe('Divisions.vue', () => {
  let component

  beforeEach(() => {

    // key: 'abc'
    searchItem: jest.fn()
    component = shallow(Divisions)
    component.setData({
      pageFirst: true,
      editedItem: {
        id: '',
        name: 'brenda',
        status: ''
      },
      items: [{
        id: '',
        name: 'abc',
        status: ''
      }]
    })
  })

  it('should called Divisions', function () {
    const wrapper = shallow(Divisions)
    expect(wrapper.name()).toEqual('Divisions')
  })
  it('should renders without errors', function () {
    const wrapper = shallow(Divisions)
    expect(wrapper.isVueInstance()).toBeTruthy()
  });
  // it('test function init', async() => {
  //   const wrapper = shallow(Divisions)
  //   await flushPromises()
  //   wrapper.vm.init()
  //   expect(component.fetchItem).toHaveBeenCalled()
  //   expect(component.searchItem).toHaveBeenCalled()
  //   expect(component.prevButton).toHaveBeenCalled()
  //   expect(component.nextButton).toHaveBeenCalled()
  // })
  // it('should call searchItem when btnSearch is clicked', () => {
  //   const wrapper = shallow(Divisions)
  //   const button = wrapper.find('.btnSearch')
  //   const spy = jest.fn()
  //   wrapper.vm.$on('searchItem', spy)
  //
  //   button.trigger('click')
  //   expect(spy).toHaveBeenCalledTimes(1)
  // })
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
  // it('if key = "" then do search', () => {

  //   let items= {
  //     id: 1,
  //     name: 'abc',
  //     status: true
  //   }
  //   const wrapper = mount(Divisions)
  //   // component.setData({ key: 'abc' })
  //   // expect(wrapper.vm.key).toEqual('abc')
  //   wrapper.vm.key = 'abc'
  //   // wrapper.find('[jest="btnSearch"]').trigger('click')
  //   component.vm.items
  //   component.vm.searchItem()
  //   // expect(items.name).toContainEqual(
  //   //   expect.objectContaining({ name: 'abc'})
  //   // )
  //   expect(searchItem).toHaveBeenCalled()
  // })
  it('method#prev_Button', () => {
    component.vm.prevButton()
  })
  it('method#next_Button', () => {
    component.vm.nextButton()
  })
  it('method#close_Valid_Success', () => {
    component.vm.close()
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
  })
  it('method#edit_Item_Dialog', () => {
    let items = {
      id: null,
      name: null,
      hostname: null,
      port: null,
      username: null,
      password: null,
      status: null,
      division: null
    }
    component.vm.editItem(items)
  })
  it('method#off_Delete_Item_Status', () => {
    let items = {
      id: null,
      name: null,
      hostname: null,
      port: null,
      username: null,
      password: null,
      status: null,
      division: null
    }
    component.vm.offDeleteItem(items)
    expect(axios.put).toHaveBeenCalled()
  })
  it('method#off_Delete_Item_Status_resulterror', () => {
    let items = {
      name: null,
      hostname: null,
      port: null,
      username: null,
      password: null,
      status: null,
      division: null
    }
    component.vm.offDeleteItem(items)
    console.log('error')
  })
  it('method#on_Delete_Item_Status', () => {
    let items = {
      id: null,
      name: null,
      hostname: null,
      port: null,
      username: null,
      password: null,
      status: null,
      division: null
    }
    component.vm.onDeleteItem(items)
    expect(axios.put).toHaveBeenCalled()
  })
  it('method#on_Delete_Item_Status_resulterror', () => {
    let items = {
      name: null,
      hostname: null,
      port: null,
      username: null,
      password: null,
      status: null,
      division: null
    }
    component.vm.offDeleteItem(items)
    console.log('error')
  })
  it('method#save_new_Item', function () {
    component.vm.save()
    expect(axios.post).toHaveBeenCalled()
  })
  it('method#save_editedItemId_isnot_blank_alias_editItem', function () {
    component.vm.editedItem.id = "123"
    component.vm.save()
    expect(axios.put).toHaveBeenCalled()
  })
  it('method#close_Dialog', function () {
    let defaultItem= {
      id: '1',
      name: 'abc',
      status: 'A'
    }
    component.vm.close()
    jest.useFakeTimers()
    setTimeout(() => {
      component.vm.editedItem = defaultItem
      component.vm.editedIndex = -1
      // console.log('hi')
    }, 300)
    jest.runAllTimers()
    expect(setTimeout).toHaveBeenCalled()
  })
  it('method#close_dialog ', function () {
    component.vm.close()
  })
})
