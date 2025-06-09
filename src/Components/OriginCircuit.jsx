import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios'
import * as d3 from 'd3'
import {view1_colorScheme} from "../function/view1_colorScheme";



function OriginCircuit(props){



    const param_algo = props.param_algo

    let circuit_width = props.circuit_width
    let circuit_height = props.circuit_height




    //定义是否mount的ref
    const didMount = useRef(false)

    // 数据存这儿
    let data = useRef({})



    // 画 OriginCircuit 的函数
    function draw_originalCircuit(data){


        const svg_width = circuit_width, svg_height = circuit_height
        const view4_padding_top = 10, view4_padding_left = 40
        const view4_margin_top = 0, view4_margin_bottom = 30, view4_margin_left = 0, view4_margin_right = 20
        const view4_title_height = 22
        const gate_circle_radius = 10



        // 定义一些颜色
        const view2_bgColor_0 = '#f8f8f8', view2_bgColor_1 = '#ffffff'// view2 的背景两种相间的颜色






        ///////////// 画 Original Circuit ////////////


        // // 生成数据
        // let view4_data = Object.values(data).map((d,i)=>{
        //
        //     if(i==Object.keys(data).length-1){
        //        return
        //     }
        //
        //
        //     let block_num = i
        //     let block_name = `block${i}`
        //
        //     let operation_arr = []
        //
        //     Object.values(d).forEach(_d=>{
        //         let qubit_obj = {}
        //
        //
        //         qubit_obj['gate'] = _d['hubs']['statehub0']['states']['state0']['post_gate']
        //         qubit_obj['qubit']  = _d['hubs']['statehub0']['states']['state0']['act_on']
        //
        //         operation_arr.push(qubit_obj)
        //     })
        //
        //
        //     return {
        //         'block_num': block_num,
        //         'block_name': block_name,
        //         'operation': operation_arr
        //     }
        //
        // }).filter(d=>d)//把最后一个元素undifined去除，因为最后一个state素没有gate的信息

    let view4_data = data

        console.log(view4_data)

        // 遍历所有的qubit，数一共有几种不同的qubit
        let qubit_arr = view4_data.reduce((qubit_arr, d)=>{
            d['operation'].forEach(_d=>{

                let qubit = _d['qubit']
                if(typeof qubit !== 'string' && !qubit_arr.includes(qubit)){
                    qubit_arr.push(qubit)
                }
            })

            return qubit_arr
        }, []).sort()




        const content_width = svg_width - 2*view4_padding_left - view4_margin_left - view4_margin_right
        const content_height = svg_height- view4_padding_top - view4_margin_top - view4_margin_bottom

        // const wire_height = content_height / qubit_arr.length
        const wire_height = content_height / qubit_arr.length
        const block_width = content_width / Object.keys(view4_data).length






        /////////////////// 画 代表 qubit 的 wires (从下往上画)////////////////////




        let svg = d3.select('#originalCircuit_container')
            .append('svg')
            .attr('width', svg_width)
            .attr('height', svg_height)
            .classed('svg_originalCircuit', true)


        let view4 = svg.append('g')
            .attr('transform', `translate(${view4_margin_left}, ${view4_margin_top})`)






        let content_g = view4.append('g')
            .attr('transform', `translate(${view4_padding_left}, ${view4_padding_top+view4_title_height})`)
            .attr('class', 'view4_content')




        // 画每一个block的 黑白相间的 背景
        let block_g2 = content_g.selectAll('.null')
            .data(view4_data)
            .join('g')
            .attr('class', 'block_g2')
            .attr('transform', (d,i)=>`translate(${i*block_width}, ${0})`)



        block_g2
            .append('rect')
            .attr('x', 0)
            .attr('y',  0)
            .attr('width', block_width)
            .attr('height', wire_height * qubit_arr.length)
            .attr('fill', d=>d['block_num'] % 2 == 0? view2_bgColor_0: view2_bgColor_1)



        let qubit_num = qubit_arr.length


        // 画 wires
        let wire_g = content_g.selectAll('.null')
            .data(qubit_arr)
            .join('g')
            .attr('class', 'wire_g')
            .attr('transform', (d,i)=>`translate(${0}, ${(qubit_num-1-i)*wire_height})`)




        wire_g.append('line')
            .attr('x1', 0)
            .attr('y1', wire_height/2)
            .attr('x2', content_width)
            .attr('y2', wire_height/2)
            .style('stroke', '#78b2d2')
            .style('stroke-width', 2)



        // 最左侧的q0，q1...
        wire_g.append('text')
            .html(d=>`q_${d}`)
            .attr('transform', (d,i)=>`translate(${-30}, ${wire_height/2})`)
            .style('font-size', '1em')
            .style('fill', '#3d3d3d')






        // 画每一个block的gate
        let block_g = content_g.selectAll('.null')
            .data(view4_data)
            .join('g')
            .attr('class', 'block_g')
            .attr('transform', (d,i)=>`translate(${i*block_width}, ${0})`)






        // let gates = block_g.selectAll('.null')
        //     .data(d=>d['operation'])
        //     .join('g')
        //     .attr('class', 'gate_g')
        //     .attr('transform', (d,i)=>{
        //         return `translate(${0}, ${(qubit_num-1-d['qubit'])*wire_height+wire_height/2})`
        //     })
        //
        //
        //
        //
        //
        //
        // gates.append('rect')
        //     .attr('x', block_width/2 - gate_circle_radius)
        //     .attr('y', -gate_circle_radius)
        //     .attr("width", gate_circle_radius*2)
        //     .attr("height", gate_circle_radius*2)
        //     .attr('rx', 3)
        //     .style("stroke", "#366494")
        //     .style("stroke-width", 2)
        //     .style("fill", "#ffffff")
        //
        //
        //
        //
        //
        //
        // gates.append('text')
        //     .html(d=>d['gate'])
        //     .attr('transform', `translate(${block_width/2}, ${gate_circle_radius/2})`)
        //     .style('font-size', '0.85em')
        //     .style('font-weight', 1000)
        //     .style('font-style', 'italic')
        //     .style('text-anchor', 'middle')
        //     .style('fill', "#366494")

        let gates = block_g.selectAll('.null')
            .data(d => d['operation'])
            .join('g')
            .attr('class', 'gate_g')
            .attr('transform', (d, i) => {
                if (typeof d['qubit'] === 'string') {
                    const [a, b] = d['qubit'].split('-').map(Number);
                    return `translate(${0}, ${0})`;
                }
                return `translate(${0}, ${0})`;
            });

// Handle 'cp' and 's' gates
        gates.each(function (d) {
            const gateGroup = d3.select(this);

            if ((d['gate'] === 'cp' || d['gate'] === 'cx') && typeof d['qubit'] === 'string') {
                const [a, b] = d['qubit'].split('-').map(Number);

                // Draw line from position a to b
                gateGroup.append('line')
                    .attr('x1', block_width / 2)
                    .attr('y1', (qubit_num - 1 - a) * wire_height + wire_height / 2)
                    .attr('x2', block_width / 2)
                    .attr('y2', (qubit_num - 1 - b) * wire_height + wire_height / 2)
                    .style('stroke', '#366494')
                    .style('stroke-width', 2);

                // Draw hollow dot at position a
                gateGroup.append('circle')
                    .attr('cx', block_width / 2)
                    .attr('cy', (qubit_num - 1 - a) * wire_height + wire_height / 2)
                    .attr('r', gate_circle_radius / 3)
                    .style('fill', '#ffffff')
                    .style('stroke', '#366494')
                    .style('stroke-width', 2);

                // Draw as-is symbol at position b
                gateGroup.append('rect')
                    .attr('x', block_width / 2 - gate_circle_radius)
                    .attr('y', (qubit_num - 1 - b) * wire_height + wire_height / 2 - gate_circle_radius)
                    .attr("width", gate_circle_radius * 2)
                    .attr("height", gate_circle_radius * 2)
                    .attr('rx', 3)
                    .style("stroke", "#366494")
                    .style("stroke-width", 2)
                    .style("fill", "#ffffff");

                gateGroup.append('text')
                    .html(d => d['gate'])
                    .attr('transform', `translate(${block_width / 2}, ${(qubit_num - 1 - b) * wire_height + wire_height / 2 +3})`)
                    .style('font-size', '0.85em')
                    .style('font-weight', 1000)
                    .style('font-style', 'italic')
                    .style('text-anchor', 'middle')
                    .style('fill', "#366494");
            } else

                if (d['gate'] === 's' && typeof d['qubit'] === 'string') {


                const [a, b] = d['qubit'].split('-').map(Number);

                    gateGroup.append('line')
                        .attr('x1', block_width / 2)
                        .attr('y1', (qubit_num - 1 - a) * wire_height + wire_height / 2)
                        .attr('x2', block_width / 2)
                        .attr('y2', (qubit_num - 1 - b) * wire_height + wire_height / 2)
                        .style('stroke', '#366494')
                        .style('stroke-width', 2);

                // Draw two identical symbols for positions a and b
                [a, b].forEach(pos => {

                    gateGroup.append('rect')
                        .attr('x', block_width / 2 - gate_circle_radius)
                        .attr('y', (qubit_num - 1 - pos) * wire_height + wire_height / 2 - gate_circle_radius)
                        .attr("width", gate_circle_radius * 2)
                        .attr("height", gate_circle_radius * 2)
                        .attr('rx', 3)
                        .style("stroke", "#366494")
                        .style("stroke-width", 2)
                        .style("fill", "#ffffff");

                    gateGroup.append('text')
                        .html(d['gate'])
                        .attr('transform', `translate(${block_width / 2}, ${(qubit_num - 1 - pos) * wire_height + wire_height / 2 + gate_circle_radius / 2})`)
                        .style('font-size', '0.85em')
                        .style('font-weight', 1000)
                        .style('font-style', 'italic')
                        .style('text-anchor', 'middle')
                        .style('fill', "#366494");
                });
            } else {
                // Default behavior for other gates
                gateGroup.append('rect')
                    .attr('x', block_width / 2 - gate_circle_radius)
                    .attr('y', (qubit_num - 1 - d['qubit']) * wire_height + wire_height / 2 - gate_circle_radius)
                    .attr("width", gate_circle_radius * 2)
                    .attr("height", gate_circle_radius * 2)
                    .attr('rx', 3)
                    .style("stroke", "#366494")
                    .style("stroke-width", 2)
                    .style("fill", "#ffffff");

                gateGroup.append('text')
                    .html(d => d['gate'])
                    .attr('transform', `translate(${block_width / 2}, ${(qubit_num - 1 - d['qubit']) * wire_height + wire_height / 2 +5})`)
                    .style('font-size', '0.85em')
                    .style('font-weight', 1000)
                    .style('font-style', 'italic')
                    .style('text-anchor', 'middle')
                    .style('fill', "#366494");
            }
        });




        // 画最底下的坐标轴

        let scale_x = d3.scaleBand()
            .domain(view4_data.map(d=>d['block_num']))
            .range([0, content_width])


        content_g.append('g')
            .attr('transform', `translate(${0}, ${-10})`)
            .call(d3.axisTop(scale_x)
                .tickValues(view4_data.map(d=>d['block_num']))
                .tickFormat(d=>`Block ${d+1}`)
            )
            .attr('font-size', '0.7em')




















        ///////////// 画 View 4 的title //////////////
        //
        // // title 的 g
        // let title_g = view4.append('g')
        //     .attr('transform', `translate(${view4_padding_left}, ${view4_padding_top})`)
        //
        //
        // title_g
        //     .append('text')
        //     .html(`View Name`)
        //     .attr('transform', `translate(${45}, ${0})`)
        //     .attr('class', 'view_title_text')
        //     .style('font-size', `2em`)
        //
        //
        //
        // // icon
        // title_g
        //     .append('text')
        //     .attr('transform', `translate(${0}, ${0})`)
        //     .attr("class", "fa view_title_icon")
        //     .style('font-size', `1.8em`)
        //     .text('\uf542')
        //
        // // border
        //
        // title_g.append('rect')
        //     .attr('x', -11)
        //     .attr('y', -35)
        //     .attr('width', 224)
        //     .attr('height', view4_title_height)
        //     // .attr('rx', 5)
        //     .attr('fill', 'none')
        //     .attr('stroke', "#2f2f2f")
        //     .attr('stroke-width', '2px')
        //



    }



    //请求数据函数，基于请求到的数据 调用 render_view 画图
    function render_from_data(){


        let file_name = param_algo

        axios.get(`data/circuit-${file_name}.json`)
            // axios.get(`data/temp.json`)
            .then(res=>{

                data.current = res.data


                // 画 OriginCircuit
                draw_originalCircuit(data.current)
            })

    }




    // mount 的时候渲染一次
    useEffect(()=>{

        // 画 OriginCircuit
        render_from_data()

    }, [])



    // 当 algo 更新的时候update
    useEffect(()=>{


        // 跳过第一次 mount
        if(!didMount.current){
            didMount.current = true

            return
        }


        d3.select('.svg_originalCircuit')
            .remove()


        // 画 OriginCircuit
        render_from_data()


    }, [param_algo])





    return (
        <div id="originalCircuit_container"></div>

    )

}

export default OriginCircuit