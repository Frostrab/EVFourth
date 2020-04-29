import React from 'react';
import {Table, Empty} from 'antd';
export const TableChange = props => {
  return (
    <div style={{marginTop: 20, fontSize: '20px'}}>
      {typeof props.serverside !== 'undefined'
        ? <Table
            columns={props.columns}
            dataSource={props.data}
            expandIconColumnIndex={0}
            expandIconAsCell={false}
            size={props.size}
            loading={props.logading}
            expandedRowRender={props.expandedRowRender}
            indentSize={24}
            locale={{
              emptyText: (
                <Empty
                  description={'ไม่พบข้อมูล'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}            onChange={props.handleTableChange}
            pagination={props.pagination}
          />
        : <Table
            columns={props.columns}
            dataSource={props.data}
            expandIconColumnIndex={0}
            expandIconAsCell={false}
            size={props.size}
            locale={{
              emptyText: (
                <Empty
                  description={'ไม่พบข้อมูล'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            loading={props.logading}
            expandedRowRender={props.expandedRowRender}
            indentSize={24}
          />}
    </div>
  );
};
