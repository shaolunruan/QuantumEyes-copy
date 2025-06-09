import React, {useRef, useState} from 'react';
import * as d3 from 'd3'
import './App.css';

import {Layout, Row, Col, Form, Radio, ConfigProvider, Select, Space, Slider, InputNumber, Button} from 'antd';
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
import 'antd/dist/reset.css';
import {SisternodeOutlined} from '@ant-design/icons';




import View from "./Components/View";
import OriginCircuit from "./Components/OriginCircuit";
import Dandelion from "./Components/Dandelion";
import Legend from "./Components/Legend";
import {post} from "axios";






let width = 1100
let view_height = 560
let view1_width = 1160
let view1_height = 60
let view2_width = 700
let view2_height = 370
let container_height = 460
let circuit_width = view1_width
let circuit_height = 100
let dandelion_div_width = 360
let dandelion_div_height = 250



let top_bg_color = '#183D4E'
let centered_control_color = '#ffffff'
let container_control_color = '#ffffff'
let centered_vis_color = '#F6F6F6'
let play_btn_color = '#2c2c2c'
let progress_color = "#545454"
let centered_article_bgColor = '#ffffff'
let color_comp2_bg = '#ececec'
let color_comp3_bg = '#ececec'
let color_comp4_bg = '#f1f1f1'
let color_comp5_bg = '#f9f9f9'
let color_comp6_bg = '#f9f9f9'
let color_comp7_bg = '#ececec'
let color_linkComp_bg = '#fafafa'




function App() {


    // 控制 选择的算法
    // const [param_algo, setAlgo] = useState('qiskit_grover_2q')
    // const [param_algo, setAlgo] = useState('grover_n2_QASMBench') // 默认值
    const [param_algo, setAlgo] = useState(null) // 默认值
    // const [param_algo, setAlgo] = useState(null)
    const [theta, setTheta] = useState(1)
    const [theta_point, setTheta_point] = useState(1)


    const [statevector, setStatevector] = useState(null)
    const [clicked_gate_name, setClicked_gate_name] = useState(null)




    function handleValueChange(event){

        // setAlgo(event.target.value)
        setAlgo(event)

    }



    function handle_statevector(item1, item2, clicked_gate_name) {
        setStatevector([item1, item2])
        setClicked_gate_name(clicked_gate_name)
    }


    function change_theta(value){
        setTheta(value)
    }

    function change_pointRadius(value){
        setTheta_point(value)
    }

    function selection_clear(){
        // d3.select('.selection').style('opacity', 0)

        setAlgo(null)
    }







    return (

        <ConfigProvider theme={{ hashed: false }}>


            <div style={{width: '100%',  color: '#ffffff',
                height: `86px`, lineHeight: `27px`,
                backgroundColor: '#2E2E2E',
                paddingLeft: '150px',
                paddingTop: '18px',
            }}>

                   <div style={{float: "left"}}>
                       <p className="system-title"><SisternodeOutlined  style={{fontSize: '1.3em', float:'left'}}/> QuantumEyes
                           <br/>
                           <span className="paper-title">Towards Better Interpretability of Quantum Circuits</span></p>
                       {/*<p className="system-subtitle">A visual analytics system for quantum circuit interpretability</p>*/}
                   </div>

                <div className="linkLogos">


                    <div className="github-block">
                        <img
                            src="github_logo.png"
                            alt="GitHub Icon"
                            className="github-icon"
                        />
                        <div className="github-text">
                            <a href="https://github.com/shaolunruan/QuantumEyes-copy" target="_blank">
                                QuantumEyes
                            </a>
                        </div>
                    </div>


                    <div className="npm-block">
                        <img
                            src="npm_logo.png"
                            alt="GitHub Icon"
                            className="npm-icon"
                        />
                        <div className="npm-text">
                            <a href="https://www.npmjs.com/package/dandelion_chart" target="_blank">
                                Dandelion
                            </a>
                        </div>
                    </div>
                </div>




            </div>

            <br/>


            <div style={{width: '100%', position:'relative'}}>


                    <div className={'control centered'}>
                         {/*style={{backgroundColor:container_control_color/* *** *!/}>*/}
                        <div id={'control'}
                             className={'centered'}
                             style={{
                                 height: 50,
                                 width: width,
                                 backgroundColor:centered_control_color, /* *** */
                                 paddingLeft: '1.5em',
                                 paddingRight: '1.5em',
                             }}>


                            <Form.Item label="Algo select"
                                       style={{ width: 180 }}
                            >
                                <Select placeholder="Please select an algorithm"
                                        defaultValue={param_algo}
                                        value={param_algo}
                                        onChange={handleValueChange}
                                        style={{ width: 100 }}
                                >
                                    <Option value="grover_n2_QASMBench">Grover-n2 QASMBench</Option>
                                    <Option value="qft_n3_Qiskit">QFT-n3 Qiskit</Option>
                                    {/*<Option value="qiskit_grover_2q">Grover-n2 Qiskit</Option>*/}
                                </Select>
                            </Form.Item>


                            <Form.Item label="View1 selection">
                                <Button size={'small'} onClick={selection_clear}>Reset</Button>
                            </Form.Item>



                            {/*<Form.Item label="Form Layout"  >*/}
                            {/*    <Radio.Group>*/}
                            {/*        <Radio.Button value="horizontal">Horizontal</Radio.Button>*/}
                            {/*        <Radio.Button value="vertical">Vertical</Radio.Button>*/}
                            {/*        <Radio.Button value="inline">Inline</Radio.Button>*/}
                            {/*    </Radio.Group>*/}
                            {/*</Form.Item>*/}


                            <Form.Item label="Dandelion point:" style={{width: '300px'}}>
                                <Row>


                                    <Col>
                                        <Slider
                                            step={0.1}
                                            min={0.8}
                                            max={1.2}
                                            style={{width: '100px'}}
                                            defaultValue={1}
                                            // min={this.state.view2_qual_extent[0]}
                                            // max={this.state.view2_qual_extent[1]}
                                            // onAfterChange={setTheta}
                                            onChange={change_pointRadius}
                                            // disabled={true}
                                        />
                                    </Col>
                                    &nbsp;&nbsp;&nbsp;
                                    <Col>
                                        <InputNumber
                                            step={0.1}
                                            min={0.8}
                                            max={1.2}
                                            value={theta_point}
                                            controls={false}
                                            onChange={change_pointRadius}
                                            style={{width: '50px'}}
                                            // disabled={true}

                                        />
                                    </Col>

                                </Row>

                            </Form.Item>




                            <Form.Item label="Dandelion circle:" style={{width: '300px'}}>
                                <Row>


                                    <Col>
                                        <Slider
                                            step={0.01}
                                            min={0}
                                            max={1}
                                            style={{width: '100px'}}
                                            defaultValue={1}
                                            // min={this.state.view2_qual_extent[0]}
                                            // max={this.state.view2_qual_extent[1]}
                                            // onAfterChange={setTheta}
                                            onChange={change_theta}
                                            // disabled={check1()}
                                        />
                                    </Col>
                                    &nbsp;&nbsp;&nbsp;
                                    <Col>
                                        <InputNumber
                                            /*min={1}
                                            max={20}*/
                                            value={theta}
                                            controls={false}                                                        onChange={change_theta}
                                            onChange={change_theta}
                                            style={{width: '50px'}}
                                        />
                                    </Col>

                                </Row>

                            </Form.Item>



                        </div>
                    </div>




                    {/* View 层*/}

                    <div style={{width: '100%', height: view_height, backgroundColor: centered_vis_color}}>

                        <div className={'component centered'} style={{width: width, height: container_height}}>


                            {param_algo ? (
                                <View
                                    param_algo={param_algo}
                                    handle_statevector={handle_statevector}
                                    view1_width = {view1_width}
                                    view1_height={view1_height}
                                    view2_width = {view2_width}
                                    view2_height={view2_height}
                                ></View>
                            ) : (
                                <span className={'spaceholder'} style={{position: 'relative', width:'60%', margin: 'auto'}}>State evolution view</span>
                            )}


                        </div>



                        <div  style={{width: circuit_width}}  className={'centered'}>


                            {param_algo ? (
                                <OriginCircuit
                                    param_algo={param_algo}
                                    circuit_width={circuit_width}
                                    circuit_height={circuit_height}
                                ></OriginCircuit>
                            ) : (
                                <span className={'spaceholder'} style={{position: 'relative', width:'60%', margin: 'auto'}}>Original quantum circuit</span>
                            )}


                        </div>

                    </div>









                <div
                    className={'dandelion_div'}
                    style={{
                        width: dandelion_div_width,
                        height: dandelion_div_height,
                        position: 'absolute',
                        top: 230,
                        left: 910,
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderColor: '#d9d9d9',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {statevector ? (
                        <Dandelion
                            param_algo={param_algo}
                            statevector={statevector}
                            clicked_gate_name={clicked_gate_name}
                            theta={theta}
                            theta_point={theta_point}
                            dandelion_div_width={dandelion_div_width}
                            dandelion_div_height={dandelion_div_height}
                        ></Dandelion>
                    ) : (
                        <span className={'spaceholder'}>Dandelion chart</span>
                    )}
                </div>


            </div>





        </ConfigProvider>





  );
}

export default App;
