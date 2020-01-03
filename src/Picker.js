import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import PropTypes from 'prop-types';

function noop(){}

function isEmpty(obj){
	return Object.entries(obj).length === 0
}

export default class Picker extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			open:false,
			child:this.props.children,
			value:this.props.value ? this.props.value : this.props.defaultValue,
			label:null
		}

		if (this.state.value){
			let idx = this.props.children.findIndex(e => this.props.findValue(e, this.state.value))
			if (idx >= 0){
				this.state.label = this.props.children[idx].props.label;
			}
		}
	}

	componentDidMount(){
	}

	open = () => {
		if (!this.props.enable)
			return;
		this.setState({open:true});
		this.props.onOpen();
	}

	close = () => {
		if (!this.props.enable)
			return;
		this.setState({open:false});
		this.props.onClose();
	}

	toggle = () => {
		if (this.state.open)
			this.close();
		else
			this.open();
	}

	set = (e) => {
		this.setState({value:e.value, label:e.label, open:false});
		this.props.onValueChange(e.value, e.label);
	}

	reset = () => {
		this.set({value:null, label:null});
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if (this.props.value && this.state.value !== this.props.value){
			if (this.props.value){
				let idx = this.props.children.findIndex(e => this.props.findValue(e, this.props.value))
				if (idx >= 0){
					this.state.label = this.props.children[idx].props.label;
					this.setState({value:this.props.value, label:this.props.children[idx].props.label});
				}
			}
		}
		if (prevProps.defaultValue !== this.props.defaultValue && !this.props.value){
			if (this.props.defaultValue){
				let idx = this.props.children.findIndex(e => this.props.findValue(e, this.props.defaultValue))
				if (idx >= 0){
					this.state.label = this.props.children[idx].props.label;
					this.setState({value:this.props.defaultValue, label:this.props.children[idx].props.label});
				}
			}
		}
	}

	render() {
		const toRender = React.Children.map(this.props.children, e => {
			return {label:e.props.label, value:e.props.value, style:e.props.style};
		});
		let styleForSelection = this.props.selectedStyle;
		if (!isEmpty(this.props.placeholderStyle) && !this.state.label){
			styleForSelection = this.props.placeholderStyle;
		}
		return (
			<View style={{height:25}} >
				<TouchableOpacity style={[styles.container, this.props.style]} onPress={() => this.props.enable ? this.toggle() : noop} activeOpacity={1} >
					<Text numberOfLines={1} style={[styles.placeholder, styleForSelection]} >{this.state.label ? this.state.label : this.props.placeholder}</Text>
				</TouchableOpacity>
				{this.state.open && this.props.enable ?
					<View style={[styles.container, !isEmpty(this.props.dropDownStyle) ? this.props.dropDownStyle : this.props.style, styles.above]} >
						<Text numberOfLines={1} style={[styles.label, !isEmpty(this.props.resetStyle) ? this.props.resetStyle : this.props.labelStyle]} onPress={() => this.reset()} >{this.props.reset}</Text>
						{toRender.map((e, i) => {
							return (
								<Text numberOfLines={1} key={i} style={[styles.label, this.props.labelStyle, e.style]} onPress={() => this.set(e)} >{e.label}</Text>
							);
						})}
					</View>
					:
					null
				}
			</View>
		);
	}
}

Picker.propTypes = {
	children:PropTypes.array.isRequired,
	style:PropTypes.object,
	placeholder:PropTypes.string,
	placeholderStyle:PropTypes.object,
	selectedStyle:PropTypes.object,
	labelStyle:PropTypes.object,
	dropDownStyle:PropTypes.object,
	reset:PropTypes.string,
	resetStyle:PropTypes.object,
	onValueChange:PropTypes.func,
	onOpen:PropTypes.func,
	onClose:PropTypes.func,
	enable:PropTypes.bool,
	value:PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
	defaultValue:PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
	findValue:PropTypes.func,
};

Picker.defaultProps = {
	style: {},
	placeholder:'',
	placeholderStyle:{},
	selectedStyle:{},
	dropDownStyle:{},
	resetStyle:{},
	reset:'-',
	value:null,
	defaultValue:null,
	onValueChange:()=>{},
	onOpen:()=>{},
	onClose:()=>{},
	enable:true,
	findValue:(e, f) => e.props.value === f,
};

Picker.displayName = 'Picker';

export class Item extends React.PureComponent {
	constructor(props){
		super(props);
	}

	render(){
		return <View/>;
	}
}

Item.displayName = 'Item';

Item.propTypes = {
	label:PropTypes.string.isRequired,
	value:PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]).isRequired,
	style:PropTypes.object,
}

const styles = StyleSheet.create({
	container: {
		backgroundColor:'lightgrey',
		padding:5,
		width:200,
		overflow:'hidden'
	},
	above: {
		zIndex:2
	},
	placeholder:{
		fontSize:18,
	},
	label:{
		fontSize:16,
		marginTop:10
	}
});
