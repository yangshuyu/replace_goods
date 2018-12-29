/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, {Component} from 'react';
import {Card, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button} from 'antd';
import LoginForm from '../forms/LoginForm';
import ModalForm from '../forms/ModalForm';
import HorizontalForm from '../forms/HorizontalForm';
import BreadcrumbCustom from '../BreadcrumbCustom';
import NewSelectTable from './NewSelectTable'
import axios from 'axios'
const FormItem = Form.Item;
const Option = Select.Option;

const url = 'http://replace-goods.chaomengdata.com/v1'
class NewComponent extends Component {
    state = {
        confirmDirty: false,
        residences: [],
        strategy: [{
            value: '类别内销售最好',
            label: '类别内销售最好',

        }, {
            value: '小类中销售最好',
            label: '小类中销售最好',
        }],
        new_rule:[
            {
                value: '最高毛利率',
                label: '最高毛利率',

            }, {
                value: '店均销量',
                label: '店均销量',
            }
        ],
        data: []

    };



    child_data(data) {
        console.log('这是一个data')
        console.log(data)
        axios.post(url + '/replace_goods', {
                'foreign_item_id': data.foreign_item_id,
                'item_status': '正常'
            }
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
        axios.get(url + '/categories')
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

    }

    handleSubmit = () => {
        // e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            var category = values.category[values.category.length - 1]
            var new_amount = values.new_amount
            var start_price = values.start_price
            var end_price = values.end_price
            var new_rule = values.new_rule
            var strategy = values.strategy[0]
            var start_interest = values.start_interest
            var end_interest = values.end_interest

            if (strategy == '类别内销售最好') {
                strategy = 0
            } else {
                strategy = 1
            }
            if (new_rule == '最高毛利率') {
                new_rule = 0
            } else {
                new_rule = 1
            }

            axios.get(url + '/new_goods',{
                'params': {
                    'category': category,
                    'new_amount': new_amount,
                    'start_price': start_price,
                    'end_price': end_price,
                    'strategy': strategy,
                    'new_rule':new_rule,
                    'start_interest': start_interest,
                    'end_interest': end_interest
                }

            })
                .then((response) =>{
                    var options = []
                    response.data.data.map(item => {
                        item.channel_store_amount = item.channel_store_amount + '(' + item.channel_store_amount + ')'
                        item.interest_rate = item.interest_rate * 100 + '%' + '(' + item.sale_price + ')'
                        options.push(item)
                    })

                    this.setState({
                        data: response.data.data,
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

    onChange = (value, selectedOptions) => {
        console.log(value);
        console.log(selectedOptions[3])
        this.setState({
            inputValue: selectedOptions.map(o=>o.label).join(', ')
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
                <BreadcrumbCustom first="汰换" second="换新"/>
                <Form layout="inline" onSubmit={()=>this.handleSubmit()}>
                    <div className="gutter-box">
                        <Card title="选新" bordered={false}>
                            <FormItem
                                {...formItemLayout}
                                label="选新策略"
                            >
                                {getFieldDecorator('strategy', {
                                    initialValue: ['类别内销售最好'],
                                    rules: [{type: 'array', required: true, message: '请选择选新策略!'}],
                                })(
                                    <Cascader options={this.state.strategy}/>
                                )}

                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="核心指标"
                            >
                                {getFieldDecorator('new_rule', {
                                    initialValue: ['最高毛利率'],
                                    rules: [{type: 'array', required: true, message: '请选择核心指标!'}],
                                })(
                                    <Cascader options={this.state.new_rule} onChange={this.onChange}/>
                                )}

                            </FormItem>


                            <FormItem
                                {...formItemLayout}
                                label="商品分类"
                            >
                                {getFieldDecorator('category', {
                                    rules: [{type: 'array', required: true, message: '商品分类!'}],
                                })(
                                    <Cascader options={this.state.residences} onChange={this.onChange}/>
                                )}

                            </FormItem>

                            <FormItem>
                                <div>零售价:</div>
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('start_price', {
                                    initialValue: 0,
                                    rules: [{ required: true, message: '最低零售价' }],
                                })(
                                    <Input style={{ width: 80 }} Inputplaceholder="最低零售价" width="30"/>
                                )}
                            </FormItem>
                            <FormItem>
                                <div>至</div>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('end_price', {
                                    initialValue: 10000,
                                    rules: [{ required: true, message: '最高零售价' }],
                                })(
                                    <Input style={{ width: 80 }} placeholder="最高零售价" />
                                )}
                            </FormItem>



                            <FormItem>
                                <div>毛利率:</div>
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('start_interest', {
                                    initialValue: 0,
                                    rules: [{ required: true, message: '最低毛利率' }],
                                })(
                                    <Input style={{ width: 80 }} Inputplaceholder="最低毛利率" width="30"/>
                                )}
                            </FormItem>
                            <FormItem>
                                <div>至</div>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('end_interest', {
                                    initialValue: 100,
                                    rules: [{ required: true, message: '最高毛利率' }],
                                })(
                                    <Input style={{ width: 80 }} placeholder="最高" />
                                )}
                            </FormItem>

                            <FormItem>
                                <div>新品个数:</div>
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('new_amount', {
                                    initialValue: 3,
                                    rules: [{ required: true, message: '新品个数' }],
                                })(
                                    <Input style={{ width: 130 }} placeholder="新品个数" />
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
                <Card  bordered={false}>
                    <NewSelectTable data={this.state.data} pfn={this.child_data.bind(this)}/>
                </Card>

            </div>
        )
    }
}

const New = Form.create()(NewComponent);

export default New;