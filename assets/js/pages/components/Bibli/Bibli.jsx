import React, { Component } from "react";

export class Bibli extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataImmuable: JSON.parse(props.donnees)
        }
    }
    render () {
        const { dataImmuable } = this.state;

        console.log(dataImmuable)

        return <div>pkl</div>
    }
}