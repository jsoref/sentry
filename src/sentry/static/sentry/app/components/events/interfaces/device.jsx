import React from 'react';

const Device = React.createClass({
  propTypes: {
    model: React.PropTypes.string.isRequired,
  },
  deviceLookUpTable: {
    'iPhone9,4': 'iPhone 7 Plus',
    'iPhone9,3': 'iPhone 7',
    'iPhone9,2': 'iPhone 7 Plus',
    'iPhone9,1': 'iPhone 7',
    'iPhone8,4': 'iPhone SE',
    'iPhone8,2': 'iPhone 6S Plus',
    'iPhone8,1': 'iPhone 6S',
    'iPhone7,1': 'iPhone 6 Plus',
    'iPhone7,2': 'iPhone 6',
    'iPhone6,2': 'iPhone 5S',
    'iPhone6,1': 'iPhone 5S',
    'iPhone5,4': 'iPhone 5C',
    'iPhone5,3': 'iPhone 5C',
    'iPhone5,2': 'iPhone 5',
    'iPhone5,1': 'iPhone 5',
    'iPhone4,1': 'iPhone 4S',
    'iPhone3,3': 'iPhone 4',
    'iPhone3,2': 'iPhone 4',
    'iPhone3,1': 'iPhone 4',
    'iPhone2,1': 'iPhone 3GS',
    'iPhone1,2': 'iPhone 3G',
    'iPhone1,1': 'iPhone',
    'iPod7,1': 'iPod Touch 6G',
    'iPod5,1': 'iPod Touch 5G',
    'iPod4,1': 'iPod Touch 4G',
    'iPod3,1': 'iPod Touch 3G',
    'iPod2,1': 'iPod Touch 2G',
    'iPod1,1': 'iPod Touch 1G',
    'iPad1,1': 'iPad 1G',
    'iPad2,1': 'iPad 2',
    'iPad2,2': 'iPad 2',
    'iPad2,3': 'iPad 2',
    'iPad2,4': 'iPad 2',
    'iPad3,1': 'iPad 3',
    'iPad3,2': 'iPad 3',
    'iPad3,3': 'iPad 3',
    'iPad3,4': 'iPad 4',
    'iPad3,5': 'iPad 4',
    'iPad3,6': 'iPad 4',
    'iPad4,1': 'iPad Air',
    'iPad4,2': 'iPad Air',
    'iPad4,3': 'iPad Air',
    'iPad5,3': 'iPad Air 2',
    'iPad5,4': 'iPad Air 2',
    'iPad2,5': 'iPad Mini',
    'iPad2,6': 'iPad Mini',
    'iPad2,7': 'iPad Mini',
    'iPad4,4': 'iPad Mini 2',
    'iPad4,5': 'iPad Mini 2',
    'iPad4,6': 'iPad Mini 2',
    'iPad4,7': 'iPad Mini 3',
    'iPad4,8': 'iPad Mini 3',
    'iPad4,9': 'iPad Mini 3',
    'iPad5,1': 'iPad Mini 4',
    'iPad5,2': 'iPad Mini 4',
    'iPad6,7': 'iPad Pro (12.9 inch)',
    'iPad6,8': 'iPad Pro (12.9 inch)',
    'iPad6,3': 'iPad Pro (9.7 inch)',
    'iPad6,4': 'iPad Pro (9.7 inch)',
    'AppleTV5,3': 'Apple TV',
    'Watch1,1': 'Apple Watch',
    'Watch1,2': 'Apple Watch',
  },
  getDeviceName(model) {
    return this.deviceLookUpTable[model] === undefined ? model : this.deviceLookUpTable[model];
  },
  render() {
    let model = this.props.model;

    return (
      <span>
        {this.getDeviceName(model)}
      </span>
    );
  }
});

export default Device;
