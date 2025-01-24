import { ActivityIndicator, Dimensions, View } from 'react-native';
import { colors } from '../helper/colorConstants';

export default function Loader({ color = colors.primaryBlue, size = 100, width = Dimensions.get('window').width, height = "100%" }) {
	return (
		<View
			style={{
				width,
				height,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'transparent'
			}}
		>
			<ActivityIndicator size={size} color={color} />
		</View>
	);
}
