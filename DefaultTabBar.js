import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';

import Button from './Button';

class DefaultTabBar extends React.Component {
  static propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: PropTypes.object,
    tabStyle: PropTypes.object,
    renderTab: PropTypes.func,
    underlineStyle: PropTypes.object,
    containerWidth: PropTypes.number,
    // scrollValue: PropTypes.instanceOf(Animated.Value),
    style: PropTypes.object,
    tabBarUnderlineStyle: PropTypes.object,
  };

  static defaultProps = {
    activeTextColor: 'navy',
    inactiveTextColor: 'black',
    backgroundColor: null,
  };

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';


    return (
      <Button
        style={{ flex: 1 }}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityRole="button"
        onPress={() => onPressHandler(page)}
      >
        <View style={[styles.tab, this.props.tabStyle]}>
          <Text style={[{ color: textColor, fontWeight }, textStyle]}>
            {name}
          </Text>
        </View>
      </Button>
    );
  }

  render() {
    const { containerWidth, tabs, backgroundColor, style, scrollValue, tabBarUnderlineStyle } = this.props;

    const numberOfTabs = tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs/2,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
      //居中,
      left: containerWidth / numberOfTabs/4,
    };

    const translateX = scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    });

    const scale = this.props.tabUnderlineScaleX ? this.props.tabUnderlineScaleX : 3;

    const scaleValue = (defaultScale) => {
      let arr = new Array(numberOfTabs * 2);
      return arr.fill(0).reduce(function(pre, cur, idx){
          idx == 0 ? pre.inputRange.push(cur) : pre.inputRange.push(pre.inputRange[idx-1] + 0.5);
          idx%2 ? pre.outputRange.push(defaultScale) : pre.outputRange.push(1)
          return pre
          }, {inputRange: [], outputRange: []})
    }

    const scaleX = this.props.scrollValue.interpolate(scaleValue(scale));


    return (
      <View style={[styles.tabs, { backgroundColor }, style]}>
        {tabs.map((name, page) =>
          this.renderTab(name, page, this.props.activeTab === page, this.props.goToPage)
        )}
        <Animated.View
          style={[
            tabUnderlineStyle,
            {
              transform: [
                {translateX },
                {scaleX}
              ],
            },
            tabBarUnderlineStyle,
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});

export default DefaultTabBar;
