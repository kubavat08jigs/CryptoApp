import React from 'react';
import { Image } from 'react-native';
import { SvgUri } from 'react-native-svg';

export default function CustomImage({ uri, ...props }) {
	if (uri && uri.endsWith('.svg')) {
		return (
			<SvgUri
				width="100%"
				height="100%"
				uri={props.uri}
			/>
		);
	} else if (uri) {
		return (<Image source={{ uri }} {...props} />)
	} else {
		return (<Image source={props.source} {...props} />)
	}
}
