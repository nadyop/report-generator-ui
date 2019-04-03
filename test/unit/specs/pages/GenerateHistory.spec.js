import GenerateHistory from '@/pages/js/generatehistory.js'
import { shallow } from 'vue-test-utils'
import axios from 'axios'
import swal from 'sweetalert2'

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({})),
  delete: jest.fn(() => Promise.resolve({})),
  post: jest.fn(() => Promise.resolve({}))
}))
// jest.mock('sweetalert2', () => ({
//   // swal: jest.fn(() => Promise.resolve({})),
//   isVisible: jest.fn()
// }))
// jest.mock('sweetalert2', ()=>({
//   _sweetalert2: ()=> {
//     return {
//       default: jest.fn()
//     }
//   }
// }))

describe('GenerateHistory.vue', () => {
  let component
  jest.resetModules()
  jest.clearAllMocks()

  beforeEach(() => {
    component = shallow(GenerateHistory)
  })
  it('should called GenerateHistory', function () {
    const wrapper = shallow(GenerateHistory)
    expect(wrapper.name()).toEqual('GenerateHistory')
  });
  it('form title return = delete', () => {
    component.vm.formTitle
    expect(component.vm.formTitle).toBe('Delete')
  })
  it('method#prev_Button', () => {
    component.vm.prevButton()
  })
  it('method#next_Button', () => {
    component.vm.nextButton()
  })
  it('method#fetch_Item', () => {
    component.vm.fetchItem()
  })
  it('method#respFetchItem', () => {
    component.vm.respFetchItem
    expect(axios.get).toHaveBeenCalled()
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
      name: 'coba',
      status: true,
      requestTime: null,
      values: null
    }
    component.vm.editItem(items)
  })
  it('method#delete_Item', () => {
    // global.confirm = () => true
    let items = {
      id: 1,
      name: 'coba',
      status: true,
      requestTime: null,
      values: null
    }
    component.vm.deleteItem(items)
    // expect(swal).toBeCalled()
    // expect(swal).toHaveBeenCalled()
    // expect(swal.confirm).toBeCalled()
    // global.confirm = true
    // var swalSpy = jest.spyOn(swal.prototype, 'isLoading')
    // expect(swalSpy).toHaveBeenCalled()
    // component.vm.result = true
    // expect(axios.delete).toHaveBeenCalled()
  })
  it('method#respDeleteItem', function () {
    const mockResult = {
      value: true
    }
    const item = {
      id: 2
    }
    component.vm.respDeleteItem(mockResult, item)
    expect(axios.delete).toHaveBeenCalled()
  });
  it('method#respDeleteItem_resultfalse', function () {
    const mockResult = {
      value: false
    }
    const item = {
      id: 2
    }
    component.vm.respDeleteItem(mockResult, item)
    expect(axios.delete).toHaveBeenCalled()
  });
  it('method#respAlertDownloadItem', function () {
    const mockResult = {
      dismiss: null
    }
    component.vm.respAlertDownloadItem(mockResult)
    // console.log('I was closed by the timer')
  });
  it('method#respAlertDownloadItem_resultnot2000', function () {
    const mockResult = {
      dismiss: 1
    }
    component.vm.respAlertDownloadItem(mockResult)
  });
  it('method#description_withParam', function () {
    const mockItem = {
      email: 'a',
      id: '123',
      name: 'sdada',
      requestTime: 1537273445836,
      status: 'DONE'
    }
    component.vm.description(mockItem)
    component.vm.editedIndex = 2
    component.vm.editedItem = mockItem
    component.vm.dialogDescription = true
  });
  it('method#close_Valid_Success', () => {
    // const defaultItem = {
    //     no: 1,
    //     id: 2,
    //     name: 'sdfs',
    //     status: 'sdfs',
    //     requestTime: 1537273445836,
    //     values: []
    // }
    component.vm.close()
    // jest.setTimeout(301)
    // setTimeout(() => {
    //   component.vm.editedItem = defaultItem
    //   component.vm.editedIndex = -1
    //   done ()
    // }, 300)
  })
  it('method#download_Item', () => {
    let items = {
      id: 1,
      name: 'coba',
      status: true,
      requestTime: null,
      values: null
    }
    component.vm.downloadItem(items)
    expect(axios.get).toHaveBeenCalled()
  })
  it('method#respDownloadItemName', () => {
    const mockResponse = {
      data: {
        data: {
          id: "123",
          name: "Acvv",
          email: "abc",
          status: "DONE",
          requestTime: 1537273445836
        }
      }
    }
    component.vm.respDownloadItemName(mockResponse)
  })
  it('method#downloadItemName', function () {
    const mockResponse = {
      data: {
        data: {
          id: "123",
          name: "Acvv",
          email: "abc",
          status: "DONE",
          requestTime: 1537273445836
        }
      }
    }
    component.vm.downloadItemName(mockResponse)
    expect(axios.get).toHaveBeenCalled()
  })
  it('method#respDownloadItem', () => {
    global.open = jest.fn()
    window.URL.createObjectURL = jest.fn()
    const mockResponse = {
      data: {
        data: {
          id: "123",
          name: "Acvv",
          email: "abc",
          status: "DONE",
          requestTime: 1537273445836
        }
      }
    }
    component.vm.respDownloadItem(mockResponse)
    expect(global.open).toBeCalled()
    // expect(Sweetalert2.swal).toBeCalled()
  })
})
