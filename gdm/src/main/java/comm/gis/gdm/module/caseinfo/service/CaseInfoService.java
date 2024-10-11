package comm.gis.gdm.module.caseinfo.service;

import java.util.*;

import com.alibaba.fastjson.JSONObject;

import comm.gis.gdm.module.caseinfo.domain.*;

public interface CaseInfoService {

        /**
         * 获取某警情的统计和处警信息
         *
         */
        CaseInfoEntity getCaseDetailInfo(
                        String caseCode);

        /**
         * 获取案件列表
         * 
         * @param startTime  开始时间
         * @param endTime    结束时间
         * @param caseTypes  类型
         * @param caseSource 报案方式
         * @param orgCodes   组织
         * @param caseCode
         * @param limit
         * @return 案件列表
         */
        List<CaseInfoEntity> getCaseInfoList(String startTime, String endTime, List<Integer> caseTypes,
                        List<String> orgCodes, String gisQueryType, String gisQueryValue, String caseCode,
                        Integer limit);

        /*
         * 获取警情同环比统计
         */
        List<CaseSumEntity> getCaseTypeCount(String startTime,
                        String endTime);

        /*
         * 获取警情同环比统计详情
         */
        JSONObject getCaseTypeCountDetail(String startTime, String endTime, List<String> orgCodes,
                        List<Integer> caseTypes);

        /*
         * 获取警情统计信息
         */
        CaseStatEntity getCaseInfoStat(CaseStatVO queryVO);

        /*
         * 获取警情24小时统计信息
         */
        CaseStatEntity getCaseFor24Line(CaseStatVO queryVO);
}
