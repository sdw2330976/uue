﻿package  com.zihexin.wtc.WebService;

import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.cxf.endpoint.Client;
import org.apache.cxf.jaxws.endpoint.dynamic.JaxWsDynamicClientFactory;

import com.zhx.tools.Tool;
import com.zihexin.wtc.common.WTCTool;
import com.zihexin.wtc.dao.WTCReadPropertiesDao;

public class WTCWebServiceImpl implements WTCWebService
{
	private  Log log = LogFactory.getLog(getClass());
	
	private  static  JaxWsDynamicClientFactory jwdcf = JaxWsDynamicClientFactory.newInstance();
	private static	Client client = null;
	private WTCReadPropertiesDao wtcReadPropertiesDao;
	
	 /**
     * 转发请求数据接口服务
     * 
     * @param marketCode
     * @param methodName
     * @param data
     * @param marketSign
     * @return
     */
	public  String  reqWtcService(String marketCode, String methodName,  String data, String marketSign) {
			
			String respInfo = "";
			String queryMarketSign = "";
			
			Map mapData = null ;
		    log.info("WTC子系统————接收的请求数据" + "marketCode:"+marketCode);
		    log.info("methodName:"+methodName);
		    log.info("data:"+data);
		    log.info("marketSign:"+marketSign);
		    
		    try{
		    	
				mapData = wtcReadPropertiesDao.queryMarketCodeMap(marketCode);
				
				queryMarketSign = String.valueOf(mapData.get("MARKET_KEY"));
				
				String strMd5 = marketCode+methodName+data+queryMarketSign;
				if(WTCTool.MD5encrypt(strMd5).equals(marketSign)){
					
					//webService接口业务
					if("2".equals(String.valueOf(mapData.get("TYPE")))){
						respInfo = getWebServiceRespData( marketCode, methodName, data, marketSign);
					}else if("1".equals(String.valueOf(mapData.get("TYPE")))){
						
						//调用ICE处理业务
					}else if("0".equals(String.valueOf(mapData.get("TYPE")))){
						
						//funcation函数
					}else{
						respInfo = "业务处理类型无效！";
					}
					
				  
				}else{
					respInfo = "验签失败,MD5错误！";
					log.error(respInfo);
				 }
				
				
		    }catch (Exception e) {
		    	respInfo = "WTC子系统————业务请求异常！";
				log.error(respInfo);
				e.printStackTrace();
			}
			
			 return respInfo;
	}
	
	
	/**
	 * 获取响应的数据
	 * @param marketCode
	 * @param methodName
	 * @param data
	 * @param marketSign
	 * @return
	 */
	public  String  getWebServiceRespData(String marketCode, String methodName, String data, String marketSign) {
		String  respInfo = "";
		Map mapData = null;
		
		try{
			
			mapData = wtcReadPropertiesDao.queryMarketCodeMap(marketCode);
			String market_Code = String.valueOf(mapData.get("MARKET_CODE"));
		    String marketKey = String.valueOf(mapData.get("MARKET_KEY"));
		    String reqData = data;
			String sign = market_Code+methodName+reqData+marketKey;
			
			//设置接口参数
			Object[] params = new Object[] {market_Code,methodName,reqData,Tool.MD5encrypt(sign)};
			
			//设置webService服务端的地址
			//if(client == null){
				//client = jwdcf.createClient(String.valueOf(mapData.get("URL"))); //TODO liujiansheng 作为调试，暂改为我本机wtc地址
				//client = jwdcf.createClient("http://10.5.13.177:7001/IcbcBlank_WebService/bankWebService?wsdl") ;//工行联调
			client = jwdcf.createClient("http://10.5.13.177:7001/CmbErpBlank_WebService/bankWebService?wsdl") ;//招行ERP联调
			//}
			//调用webService服务端接口方法
			Object[] returnResult = client.invoke(String.valueOf(mapData.get("METHOD_NAME")), params); 
			respInfo = returnResult[0].toString();
			
	    }catch (Exception e) {
	    	respInfo = "WTC子系统————业务请求异常！";
			log.error(respInfo);
			e.printStackTrace();
		}
		return  respInfo;
	}


	public WTCReadPropertiesDao getWtcReadPropertiesDao() {
		return wtcReadPropertiesDao;
	}


	public void setWtcReadPropertiesDao(WTCReadPropertiesDao wtcReadPropertiesDao) {
		this.wtcReadPropertiesDao = wtcReadPropertiesDao;
	}
	
	
	
}