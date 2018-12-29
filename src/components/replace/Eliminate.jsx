/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, {Component} from 'react';
import {Card, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import EliminateSelectTable from './EliminateSelectTable'
import axios from 'axios'
const FormItem = Form.Item;
const Option = Select.Option;

const url = 'http://replace-goods.chaomengdata.com/v1'

class EliminateComponent extends Component {
    state = {
        confirmDirty: false,
        residences: [],
        storage_areas: [{
            value: '无',
            label: '无'
        }],
        strategy: [{
            value: '类别内销售最差',
            label: '类别内销售最差',

        }, {
            value: '小类中销售最差',
            label: '小类中销售最差',
        }],
        elimination_rule: [
            {
                value: '店均销售量',
                label: '店均销售量',

            }, {
                value: '毛利率',
                label: '毛利率',
            }
        ],
        data: [],
        chain_category: '',
        storage_area: ''

    };


    child_data(data) {
        console.log('这是一个data')
        console.log(data)
        axios.post(url + '/replace_goods', {
                'foreign_item_id': data.foreign_item_id,
                'item_status': '正常'
            },
        )
            .then((response) => {
                var foreign_item_id = response.data.data.foreign_item_id
                let list = this.state.data;
                list.splice(list.findIndex(data => data.foreign_item_id === foreign_item_id), 1);
                this.setState({
                    data: list,
                    isLoaded: true
                });
            })
            .catch((response) => {
                console.log(response);
                this.setState({
                    isLoaded: false,
                    error: response
                })
            })
    }

    componentDidMount() {
        const _this = this;
        axios.get(url + '/categories', {
            changeOrigin:true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then(function (response) {
                var options = []
                response.data.data.map(item => {
                    options.push({
                        value: item.id,
                        label: item.name,
                        children: item.foreign_category_lv2s.map(lv2 => {
                            return {
                                value: lv2.id,
                                label: lv2.name,
                                children: lv2.foreign_category_lv3s.map(lv3 => {
                                    return {
                                        value: lv3.id,
                                        label: lv3.name,
                                        children: lv3.foreign_category_lv4s.map(lv4 => {
                                            return {
                                                value: lv4.id,
                                                label: lv4.name,
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    })

                })


                _this.setState({
                    residences: options,
                    isLoaded: true
                });
            })
            .catch(function (error) {
                console.log(error);
                _this.setState({
                    isLoaded: false,
                    error: error
                })
            })

        axios.get(url + '/storage_area')
            .then(function (response) {
                var options = [{
                    value: '无',
                    label: '无'
                }]
                response.data.data.map(item => {
                    console.log(item);
                    options.push({
                        value: item.storage_area,
                        label: item.storage_area
                    })

                })

                _this.setState({
                    storage_areas: options,
                    isLoaded: true
                });
            })
            .catch(function (error) {
                console.log(error);
                _this.setState({
                    isLoaded: false,
                    error: error
                })
            })

    }

    handleSubmit = () => {
        // e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            var elimination_rule = values.elimination_rule[0]
            var strategy = values.strategy[0]
            var eliminate_amount = values.eliminate_amount

            if (strategy == '类别内销售最差') {
                strategy = 0
            } else {
                strategy = 1
            }
            if (elimination_rule == '店均销售量') {
                elimination_rule = 0
            } else {
                elimination_rule = 1
            }

            axios.get(url + '/goods/eliminate', {
                params: {
                    'chain_category': this.state.chain_category,
                    'storage_area': this.state.storage_area,
                    'eliminate_amount': eliminate_amount,
                    'elimination_rule': elimination_rule,
                    'strategy': strategy
                }
            })
                .then((response) => {
                    var options = []
                    response.data.data.map(item => {
                        item.average_store_quantity = item.average_store_quantity + '(' + item.store_quantity_rank + ')'
                        item.quantity = item.quantity + '(' + item.quantity_rank + ')'
                        item.sale = item.sale + '(' + item.sale + ')'
                        item.profit = item.profit + '(' + item.profit_rank + ')'
                        options.push(item)
                    })

                    this.setState({
                        data: options,
                        isLoaded: true
                    });
                })
                .catch((response)=> {
                    console.log(response);
                    this.setState({
                        isLoaded: false,
                        error: response
                    })
                })

        });
    };

    onCategoryChange = (value, selectedOptions) => {
        console.log(value);
        console.log(selectedOptions.length)
        this.setState({
            chain_category: selectedOptions[selectedOptions.length - 1].value
        });
        const onChange = this.props.onChange;

        if (onChange) {
            onChange({...value});
        }
    }

    onAreaChange = (value, selectedOptions) => {
        console.log(value);
        console.log(selectedOptions)
        this.setState({
            storage_area: selectedOptions[selectedOptions.length - 1].value
        });
        const onChange = this.props.onChange;

        if (onChange) {
            onChange({...value});
        }
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="汰换" second="淘汰"/>

                <Form layout="inline" onSubmit={()=>this.handleSubmit()}>
                    <div className="gutter-box">
                        <Card title="淘汰" bordered={false}>

                            <FormItem
                                {...formItemLayout}
                                label="淘汰策略"
                            >
                                {getFieldDecorator('strategy', {
                                    initialValue: ['类别内销售最差'],
                                    rules: [{type: 'array', required: true, message: '请选择淘汰策略!'}],
                                })(
                                    <Cascader options={this.state.strategy}/>
                                )}

                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="核心指标"
                            >
                                {getFieldDecorator('elimination_rule', {
                                    initialValue: ['店均销售量'],
                                    rules: [{type: 'array', required: true, message: '请选择核心指标!'}],
                                })(
                                    <Cascader options={this.state.elimination_rule}/>
                                )}

                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="店内分区"
                            >
                                {getFieldDecorator('storage_area', {
                                    initialValue: ['无'],
                                    rules: [{type: 'array', required: false, message: '请选择店内分区!'}],
                                })(
                                    <Cascader options={this.state.storage_areas} onChange={this.onAreaChange}/>
                                )}

                            </FormItem>


                            <FormItem
                                {...formItemLayout}
                                label="商品分类"
                            >
                                {getFieldDecorator('category', {
                                    rules: [{type: 'array', required: true, message: '商品分类!'}],
                                })(
                                    <Cascader options={this.state.residences} onChange={this.onCategoryChange}/>
                                )}

                            </FormItem>

                            <FormItem>
                                <div>汰品个数</div>
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('eliminate_amount', {
                                    initialValue: 3,
                                    rules: [{required: true, message: '汰品个数'}],
                                })(
                                    <Input placeholder="汰品个数"/>
                                )}
                            </FormItem>

                        </Card>

                        <Card bordered={false}>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >

                                    计算
                                </Button>
                            </FormItem>
                        </Card>

                    </div>
                </Form>
                <Card title="淘汰数据" bordered={false}>
                    <EliminateSelectTable data={this.state.data} pfn={this.child_data.bind(this)}/>
                </Card>

            </div>
        )
    }
}

const Eliminate = Form.create()(EliminateComponent);

export default Eliminate;