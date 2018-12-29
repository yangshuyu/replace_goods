/**
 * Created by hao.cheng on 2017/4/15.
 */
import React from 'react';
import {Table, Button} from 'antd';

class EliminateSelectTable extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        selectedRowKeys: [], // Check here to configure the default column
        columns: [{
            title: '商品分类',
            dataIndex: 'foreign_category_lv3_name',
        }, {
            title: '商品名称',
            dataIndex: 'item_name',
        }, {
            title: '店均销售量(排名)',
            dataIndex: 'average_store_quantity',
        }, {
            title: '总销量(排名)',
            dataIndex: 'quantity',
        }, {
            title: '销售额(排名)',
            dataIndex: 'sale',
        }, {
            title: '毛利额(排名)',
            dataIndex: 'profit',
        }, {
            title: '毛利率',
            dataIndex: 'interest_rate',
        }, {
            title: '上架率',
            dataIndex: 'self_rate',
        }, {
            title: '动销率',
            dataIndex: 'marketing_rate',
        }, {
            title: '处理建议',
            dataIndex: 'suggest',
        },{
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
            <Button onClick={()=>this.eliminate(record)}>淘汰</Button>
        </span>
            ),
        }]
    };

    eliminate = (record) => {
        this.props.pfn(record)
    };

    onSelectChange = (selectedRowKeys, data) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        console.log(data)
        this.props.pfn(data)
        this.setState({selectedRowKeys});
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

export default EliminateSelectTable;