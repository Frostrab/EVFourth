import React from 'react'
import { Upload, Button, Icon, message } from 'antd'

export default class Test extends React.Component {
  state = {
    fileList: [],
    uploading: false,
  }

  handleUpload = () => {
    const { fileList } = this.state
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('files[]', file)
    })

    this.setState({
      uploading: true,
    })

    // You can use any AJAX library you like
  }

  render() {
    const { uploading, fileList } = this.state
    const props = {
      listType: 'picture',
      previewFile(file) {
        console.log('Your upload file:', file)
        // Your process logic. Here we just mock to the same file
        return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
          method: 'POST',
          body: file,
        })
          .then(res => res.json())
          .then(({ thumbnail }) => thumbnail)
      },
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }))
        return false
      },
      fileList,
    }

    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </div>
    )
  }
}
