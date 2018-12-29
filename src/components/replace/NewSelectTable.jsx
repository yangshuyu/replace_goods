/**
 * Created by hao.cheng on 2017/4/15.
 */
import React from 'react';
import {Table, Button} from 'antd';


class NewSelectTable extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        selectedRowKeys: [], // Check here to configure the default column
        columns: [{
            title: '淘品名称',
            dataIndex: 'a',
        }, {
            title: '商品分类',
            dataIndex: 'foreign_category_lv3_name',
        }, {
            title: '新品名称',
            dataIndex: 'item_name',
        }, {
            title: '店均销售量',
            dataIndex: 'average_store_quantity',
        }, {
            title: '铺货渠道数',
            dataIndex: 'channel_amount',
        }, {
            title: '渠道总门店数',
            dataIndex: 'has_inventory_count',
        }, {
            title: '铺货门店数(上架率)',
            dataIndex: 'channel_store_amount',
        }, {
            title: '最高毛利率(零售价)',
            dataIndex: 'interest_rate',
        }, {
            title: '处理建议',
            dataIndex: 'suggest',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
            <Button onClick={()=>this.choose_new(record)}>选新</Button>
        </span>
            ),
        }]
    }
        ;


    onSelectChange = (selectedRowKeys, data) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        console.log(data)
        this.props.pfn(data)
        this.setState({selectedRowKeys});
    };

    choose_new = (record) => {
        this.props.pfn(record)
    };

    render() {
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [{
                key: 'odd',
                text: '选择奇数列',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    this.setState({selectedRowKeys: newSelectedRowKeys});
                },
            }, {
                key: 'even',
                text: '选择偶数列',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                        if (index % 2 !== 0) {
                            return true;
                        }
                        return false;
                    });
                    this.setState({selectedRowKeys: newSelectedRowKeys});
                },
            }],
            onSelection: this.onSelection,
        };
        return (
            <Table rowSelection={rowSelection} columns={this.state.columns} dataSource={this.props.data}/>
        );
    }
}

export default NewSelectTable;