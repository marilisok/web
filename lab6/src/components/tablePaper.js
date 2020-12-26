import React, {Component} from 'react';
import {TD} from "./td";
import {TDselect} from "./tdSelect";

export class TablePaper extends Component {
    render() {
        const value = this.props;
        const items = value.papers.map((paper) => {
            return <TD key={paper.name} value={paper.name}/>
        });
        const counts = value.papers.map((paper) => {
            return <TD key={paper.name} value={paper.count}/>
        });
        const rules = value.papers.map((paper) => {
            return <TDselect key={paper.name} rule={paper.rule} name={paper.name} isStart={value.isStart} socket={value.socket}/>
        });
        return (
            <table className="w3-table-all w3-hoverable w3-centered w3-card-4 w3-center w3-margin-top">
                <caption className="w3-orange"><b>Информация об акциях</b></caption>
                <tr className="w3-light-green">
                    <td></td>
                    {items}
                </tr>
                <tr>
                    <td className="w3-amber">Общее количество</td>
                    {counts}
                </tr>
                <tr>
                    <td className="w3-light-green">Закон распределения</td>
                    {rules}
                </tr>
            </table>
        );
    }
}
