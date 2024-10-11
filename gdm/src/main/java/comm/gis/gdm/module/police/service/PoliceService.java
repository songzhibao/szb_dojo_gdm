package comm.gis.gdm.module.police.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;

import comm.gis.gdm.module.police.domain.*;

public interface PoliceService {

        /*
         * 获取警力类型统计数据
         */
        List<PoliceStatTypeEntity> getPoliceTypeStatInfo(List<String> orgCodes, List<String> policeStatus,
                        List<String> policeTypes);

        /*
         * 获取警力状态统计数据
         */
        List<PoliceStatStatusEntity> getPoliceStatusStatInfo(List<String> orgCodes, List<String> policeStatus,
                        List<String> policeTypes);

        /*
         * 获取警力列表数据
         */
        List<PoliceInfoEntity> getPoliceInfos(List<String> orgCodes, List<String> policeStatus,
                        List<String> policeTypes);

        /*
         * 获取警力单位统计数据
         */
        List<PoliceStatOrgEntity> getPoliceOrgStatInfo(List<String> orgCodes, List<String> policeStatus,
                        List<String> policeTypes);

        /*
         * 获取创建人警力列表
         */
        List<PoliceInfoEntity> getPoliceInfosByCreator(
                        List<String> orgCodes, String keyWord);

        /*
         * 获取单位树形警力数据
         */
        List<OrgInfoWithPolicesEntity> getPolicesWithOrgTree(
                        List<String> orgCodes, String keyWord);

        /*
         * 获取单位和形警力数据
         */
        List<JSONObject> getPolicesWithOrg(
                        List<String> orgCodes, String keyWord);

        /*
         * 保存调度分组信息
         */
        Boolean saveCallGroup(CallGroupEntity param);

        /*
         * 删除调度呼叫组
         */
        Boolean deleteCallGroup(String operator,
                        String operatorOrg,
                        String groupId);

        /*
         * 获取调度呼叫组列表
         */
        List<CallGroupEntity> getCallGroupList(
                        String operator, String operatorOrg);

        /*
         * 修改警力状态信息
         */
        Boolean updatePoliceStatus(PoliceStatusTypeEnum status, String markName, String device_code);
}
