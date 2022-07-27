import { DEVICE_PIXEL_RATIO_LIST } from 'cloudimage-responsive-utils/dist/constants';


export const generateURL = props => {
  const { src, params, config = {}, containerProps = {}, devicePixelRatio = 1, processQueryString, service } = props;
  const { sizes } = containerProps;
  const size = sizes && sizes[DEVICE_PIXEL_RATIO_LIST.indexOf(devicePixelRatio)];
  const { width, height } = size || {};

  return [
    '/cdn-cgi/image/',
    getResizeParamString({
      params: { ...(config.params || {}), ...params },
      width,
      height,
      config,
      processQueryString,
      devicePixelRatio,
      service
    }),
    src.startsWith('/') ? src : ['/', src].join('')
  ].join('');
};

const getResizeParamString = props => {
  const { params = {}, width, height, config = {} } = props;
  const { processOnlyWidth } = config;
  const [restParams, widthFromParam = null, heightFromParam] = processParamsExceptSizeRelated(params);
  const widthQ = width ? width : widthFromParam;
  const heightQ = height ? height : heightFromParam;
  const restParamsQ = Object
    .keys(restParams)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(restParams[key]))
    .join(',');
  const query = [
    widthQ ? `width=${widthQ}` : '',
    (heightQ && !processOnlyWidth) ? ((widthQ ? ',' : '') + `height=${heightQ}`) : '',
    restParamsQ ? ',' + restParamsQ : ''
  ].join('');

  return query;
};

const processParamsExceptSizeRelated = params => {
  const { w, h, width, height, ...restParams } = params;

  return [restParams, w || width, h || height];
};
