package comm.gis.gdm.module.police.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import comm.gis.gdm.mapper.CallGroupMapper;
import comm.gis.gdm.mapper.CallGroupMemberMapper;
import comm.gis.gdm.mapper.DicMapper;
import comm.gis.gdm.mapper.OrganizationMapper;
import comm.gis.gdm.mapper.PoliceMapper;
import comm.gis.gdm.module.police.domain.*;
import comm.gis.gdm.module.police.service.PoliceService;
import comm.gis.gdm.module.system.domain.*;
import comm.gis.gdm.util.SqlUtils;
import comm.gis.gdm.util.TimeUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PoliceServiceImpl implements PoliceService {

        @Autowired
        private DicMapper dicDao;

        @Autowired
        private PoliceMapper policeDao;

        @Autowired
        private OrganizationMapper orgMapper;

        @Autowired
        private CallGroupMapper callgroupMapper;

        @Autowired
        private CallGroupMemberMapper callgroupMemberMapper;

        @Autowired
        private ApplicationContext context;

        @Override
        public List<PoliceStatTypeEntity> getPoliceTypeStatInfo(List<String> orgCodes, List<String> policeStatus,
                        List<String> policeTypes) {

                String orgFilter = SqlUtils.getOrgFilter("orgid", orgCodes);
                String typeFilter = SqlUtils.fillParam(policeTypes, " and typeid in (%s) ");
                String statusFilter = SqlUtils.fillParam(policeStatus, " and statusid in (%s) ");
                // 获取警力类型总数统计
                List<Map<String, Object>> resultList = this.policeDao
                                .selectPoliceTypeStatList(typeFilter + statusFilter + orgFilter);

                List<PoliceStatTypeEntity> typeStatList = new ArrayList<>();
                List<PoliceTypeEntity> typeList = this.dicDao.selectDicPoliceType(policeTypes);
                typeList.forEach(type -> {

                        PoliceStatTypeEntity newType = new PoliceStatTypeEntity();
                        newType.setTypeCode(type.getTypeCode());
                        newType.setTypeName(type.getTypeName());
                        newType.setOrderNumber(type.getOrderNumber());

                        List<Map<String, Object>> filterList = resultList.stream()
                                        .filter(o -> o.get("typeid") != null
                                                        && o.get("typeid").equals(type.getTypeCode()))
                                        .collect(Collectors.toList());

                        filterList.forEach(map -> {
                                if (map.get("onlinestatus") != null
                                                && "online".equals(map.get("onlinestatus").toString())) {
                                        // 在线
                                        newType.setOnlineCount(newType.getOnlineCount()
                                                        + Integer.parseInt(map.get("typecount") == null ? "0"
                                                                        : map.get("typecount").toString()));
                                }
                                newType.setTotalCount(newType.getTotalCount()
                                                + Integer.parseInt(map.get("typecount") == null ? "0"
                                                                : map.get("typecount").toString()));
                        });

                        typeStatList.add(newType);
                });

                return typeStatList;
        }

        @Override
        public List<PoliceStatStatusEntity> getPoliceStatusStatInfo(List<String> orgCodes, List<String> policeStatus,
                        List<String> policeTypes) {

                String orgFilter = SqlUtils.getOrgFilter("orgid", orgCodes);
                String typeFilter = SqlUtils.fillParam(policeTypes, " and typeid in (%s) ");
                String statusFilter = SqlUtils.fillParam(policeStatus, " and statusid in (%s) ");
                // 获取警力类型总数统计
                List<Map<String, Object>> resultList = this.policeDao
                                .selectPoliceStatusStatList(typeFilter + statusFilter + orgFilter);

                List<PoliceStatusEntity> statusList = this.dicDao.selectDicPoliceStatus(policeStatus);

                List<PoliceStatStatusEntity> relist = new ArrayList<>();
                statusList.forEach(status -> {

                        PoliceStatStatusEntity bean = new PoliceStatStatusEntity();
                        bean.setStatusId(status.getStatusId());
                        bean.setStatusCode(status.getStatusCode());
                        bean.setStatusName(status.getStatusName());

                        List<Map<String, Object>> filterList = resultList.stream()
                                        .filter(o -> o.get("statusid") != null
                                                        && o.get("statusid").equals(status.getStatusId()))
                                        .collect(Collectors.toList());

                        filterList.forEach(map -> {
                                if (map.get("onlinestatus") != null
                                                && "online".equals(map.get("onlinestatus").toString())) {
                                        // 在线
                                        bean.setOnlineCount(bean.getOnlineCount()
                                                        + Integer.parseInt(
                                                                        map.get("statuscount") == null ? "0"
                                                                                        : map.get("statuscount")
                                                                                                        .toString()));
                                }
                                bean.setTotalCount(bean.getTotalCount()
                                                + Integer.parseInt(map.get("statuscount") == null ? "0"
                                                                : map.get("statuscount").toString()));
                        });
                        relist.add(bean);
                });

                return relist;
        }

        @Override
        public List<PoliceInfoEntity> getPoliceInfos(List<String> orgCodes, List<String> policeStatus,
                        List<String> policeTypes) {
                String orgFilter = SqlUtils.getOrgFilter("orgid", orgCodes);
                String typeFilter = SqlUtils.fillParam(policeTypes, " and typeid in (%s) ");
                String statusFilter = SqlUtils.fillParam(policeStatus, " and statusid in (%s) ");
                // 获取警力类型总数统计
                List<PoliceInfoEntity> resultList = this.policeDao
                                .selectPoliceInfoList(typeFilter + statusFilter + orgFilter);

                return resultList;
        }

        @Override
        public List<PoliceStatOrgEntity> getPoliceOrgStatInfo(List<String> orgCodes, List<String> policeStatus,
                        List<String> policeTypes) {

                String orgFilter = SqlUtils.getOrgFilter("orgid", orgCodes);
                String typeFilter = SqlUtils.fillParam(policeTypes, " and typeid in (%s) ");
                String statusFilter = SqlUtils.fillParam(policeStatus, " and statusid in (%s) ");

                // 获取警力类型总数统计
                List<Map<String, Object>> resultTypeList = this.policeDao
                                .selectPoliceTypeOrgStatList(typeFilter + statusFilter + orgFilter);

                List<PoliceTypeEntity> typeList = this.dicDao.selectDicPoliceType(policeTypes);

                // 获取警力类型总数统计
                List<Map<String, Object>> resultList = this.policeDao
                                .selectPoliceOrgStatList(typeFilter + statusFilter + orgFilter);

                List<Map<String, Object>> childOrgList = this.orgMapper.selectChildOrgListWithCodes(orgCodes);

                List<PoliceStatOrgEntity> relist = new ArrayList<>();
                for (Map<String, Object> map : childOrgList) {
                        PoliceStatOrgEntity bean = new PoliceStatOrgEntity();
                        bean.setOrgId(map.get("id").toString());
                        bean.setOrgCode(map.get("id").toString());
                        bean.setOrgName(map.get("name").toString());

                        if (bean.getOrgId() == null) {
                                continue;
                        }

                        List<Map<String, Object>> filterList = resultList.stream()
                                        .filter(o -> bean.getOrgId().equals(o.get("orgid"))
                                                        || (map.get("childcode") != null
                                                                        && map.get("childcode").toString()
                                                                                        .indexOf(bean.getOrgId()) >= 0))
                                        .collect(Collectors.toList());

                        filterList.forEach(one -> {
                                if (one.get("onlinestatus") != null
                                                && "online".equals(one.get("onlinestatus").toString())) {
                                        // 在线
                                        bean.setOnlineCount(bean.getOnlineCount()
                                                        + Integer.parseInt(
                                                                        one.get("orgcount") == null ? "0"
                                                                                        : one.get("orgcount")
                                                                                                        .toString()));
                                }
                                bean.setTotalCount(bean.getTotalCount()
                                                + Integer.parseInt(one.get("orgcount") == null ? "0"
                                                                : one.get("orgcount").toString()));
                        });

                        // 统计每个单位的类型数据
                        List<PoliceStatTypeEntity> typeStatList = new ArrayList<>();
                        bean.setPoliceTypeList(typeStatList);

                        typeList.forEach(type -> {
                                List<Map<String, Object>> filterTypeList = resultTypeList.stream()
                                                .filter(o -> (o.get("typeid") != null
                                                                && o.get("typeid").equals(type.getTypeCode()))
                                                                && (bean.getOrgId().equals(o.get("orgid")) || (map
                                                                                .get("childcode") != null
                                                                                && map.get("childcode").toString()
                                                                                                .indexOf(bean.getOrgId()) >= 0)))
                                                .collect(Collectors.toList());

                                PoliceStatTypeEntity newType = new PoliceStatTypeEntity();
                                newType.setTypeCode(type.getTypeCode());
                                newType.setTypeName(type.getTypeName());
                                newType.setOrderNumber(type.getOrderNumber());

                                filterTypeList.forEach(typeMap -> {
                                        if (typeMap.get("onlinestatus") != null
                                                        && "online".equals(typeMap.get("onlinestatus").toString())) {
                                                // 在线
                                                newType.setOnlineCount(newType.getOnlineCount()
                                                                + Integer.parseInt(
                                                                                typeMap.get("typecount") == null ? "0"
                                                                                                : typeMap.get("typecount")
                                                                                                                .toString()));
                                        }
                                        newType.setTotalCount(newType.getTotalCount()
                                                        + Integer.parseInt(
                                                                        typeMap.get("typecount") == null ? "0"
                                                                                        : typeMap.get("typecount")
                                                                                                        .toString()));
                                });

                                typeStatList.add(newType);
                        });

                        relist.add(bean);
                }

                relist.sort(Comparator.comparing(PoliceStatOrgEntity::getTotalCount).reversed());

                return relist;
        }

        @Override
        public List<PoliceInfoEntity> getPoliceInfosByCreator(
                        List<String> orgCodes, String keyWord) {
                String orgFilter = SqlUtils.getOrgFilter("orgid", orgCodes);
                String keyWordFiltger = " and itemcode in(SELECT operator FROM gdm_event_info WHERE operator is not null and time > CURRENT_DATE + interval '-30 D'  GROUP BY operator) ";
                if (keyWord != null && !"".equals(keyWord)) {
                        keyWordFiltger += " and (policename like '%" + keyWord + "%' or policenumber like CONCAT('%"
                                        + keyWord + "%'))";
                }

                List<PoliceInfoEntity> resultList = this.policeDao
                                .selectPoliceInfoList(orgFilter + keyWordFiltger);

                return resultList;
        }

        @Override
        public List<OrgInfoWithPolicesEntity> getPolicesWithOrgTree(
                        List<String> orgCodes, String keyWord) {

                List<OrgInfoWithPolicesEntity> reList = new ArrayList<>();

                String orgFilter = SqlUtils.getOrgFilter("orgid", orgCodes);
                String keyWordFiltger = "";
                if (keyWord != null && !"".equals(keyWord)) {
                        keyWordFiltger += " and (policename like '%" + keyWord + "%' or policenumber like '%"
                                        + keyWord + "%')";
                }

                List<PoliceInfoEntity> resultList = this.policeDao.selectPoliceInfoList(orgFilter + keyWordFiltger);
                if (resultList != null && resultList.size() > 0) {
                        List<OrgInfoEntity> orgs = this.orgMapper.selectOrgInfos(orgCodes);
                        if (orgs != null) {

                                for (String orgId : orgCodes) {
                                        Optional<OrgInfoEntity> orgInfo = orgs.stream()
                                                        .filter(o -> o.getOrgId().equals(orgId)).findFirst();
                                        if (orgInfo != null && orgInfo.isPresent()) {
                                                OrgInfoWithPolicesEntity org = this.ConvertOrg(orgInfo.get());
                                                List<PoliceInfoEntity> filterPoliceList = resultList.stream()
                                                                .filter(o -> o.getOrgId() != null
                                                                                && o.getOrgId().equals(org.getOrgId()))
                                                                .collect(Collectors.toList());
                                                List<OrgInfoWithPolicesEntity> sunOrgs = this.getChildOrgInfos(orgs,
                                                                orgInfo.get().getOrgId(),
                                                                resultList);
                                                if (filterPoliceList != null && filterPoliceList.size() > 0) {
                                                        org.setPoliceList(filterPoliceList);
                                                        org.setOrgChildren(sunOrgs);
                                                        reList.add(org);
                                                } else {
                                                        if (sunOrgs != null && sunOrgs.size() > 0) {
                                                                org.setOrgChildren(sunOrgs);
                                                                reList.add(org);
                                                        }
                                                }
                                        }
                                }

                        }
                }
                return reList;
        }

        @Override
        public List<JSONObject> getPolicesWithOrg(List<String> orgCodes, String keyWord) {

                List<JSONObject> reList = new ArrayList<>();

                String orgFilter = SqlUtils.getOrgFilter("orgid", orgCodes);
                String keyWordFiltger = " and typecode='2'";
                if (keyWord != null && !"".equals(keyWord)) {
                        keyWordFiltger += " and (policename like '%" + keyWord + "%' or policenumber like '%"
                                        + keyWord + "%')";
                }

                List<PoliceInfoEntity> resultList = this.policeDao.selectPoliceInfoList(orgFilter + keyWordFiltger);
                if (resultList != null && resultList.size() > 0) {
                        List<OrgInfoEntity> orgs = this.orgMapper.selectOrgInfos(orgCodes);
                        if (orgs != null) {

                                for (OrgInfoEntity orgInfo : orgs) {
                                        if (orgInfo != null) {
                                                JSONObject orgJSON = new JSONObject();
                                                orgJSON.put("treeId", orgInfo.getId());
                                                orgJSON.put("id", orgInfo.getId());
                                                orgJSON.put("MC", orgInfo.getName());
                                                orgJSON.put("parent", orgInfo.getParent());
                                                orgJSON.put("checked", false);
                                                reList.add(orgJSON);
                                                List<PoliceInfoEntity> filterPoliceList = resultList.stream()
                                                                .filter(o -> o.getOrgId() != null
                                                                                && o.getOrgId().equals(
                                                                                                orgInfo.getOrgId()))
                                                                .collect(Collectors.toList());

                                                if (filterPoliceList != null && filterPoliceList.size() > 0) {
                                                        for (PoliceInfoEntity police : filterPoliceList) {
                                                                JSONObject policeJSON = new JSONObject();
                                                                policeJSON.put("treeId", police.getItemId());
                                                                policeJSON.put("id", police.getItemId());
                                                                policeJSON.put("MC", police.getDeviceName());
                                                                policeJSON.put("parent", police.getOrgId());
                                                                policeJSON.put("Code", police.getMainDeviceCode());
                                                                policeJSON.put("ZW", police.getJobname());
                                                                policeJSON.put("PhoneNum", police.getPhone());
                                                                policeJSON.put("checked", false);
                                                                reList.add(policeJSON);
                                                        }
                                                }
                                        }
                                }
                        }
                }
                return reList;
        }

        @Override
        public Boolean saveCallGroup(CallGroupEntity param) {

                Boolean isSave = false;

                if (StringUtils.hasText(param.getId())) {
                        CallGroupEntity bean = this.callgroupMapper.selectById(param.getId());
                        if (bean != null) {
                                Integer cnt = this.callgroupMapper.updateById(param);
                                if (cnt > 0) {
                                        isSave = true;
                                }
                        } else {
                                Integer cnt = this.callgroupMapper.insert(param);
                                if (cnt > 0) {
                                        isSave = true;
                                }
                        }
                } else {
                        param.setId(TimeUtils.getTimeId());
                        Integer cnt = this.callgroupMapper.insert(param);
                        if (cnt > 0) {
                                isSave = true;
                        }
                }
                if (isSave) {
                        QueryWrapper<CallGroupMemberEntity> wrapper = new QueryWrapper<>();
                        wrapper.eq("group_id", param.getId());
                        this.callgroupMemberMapper.delete(wrapper);

                        List<CallGroupMemberEntity> polices = param.getMemberList();
                        if (polices != null && polices.size() > 0) {
                                for (CallGroupMemberEntity p : polices) {
                                        if (!StringUtils.hasText(p.getGroupId())) {
                                                p.setGroupId(param.getId());
                                        }
                                        p.setId(TimeUtils.getTimeId());
                                        this.callgroupMemberMapper.insert(p);
                                }
                        }
                }
                return isSave;
        }

        @Override
        public Boolean deleteCallGroup(String operator,
                        String operatorOrg,
                        String groupId) {
                if (StringUtils.hasText(groupId)) {
                        CallGroupEntity bean = this.callgroupMapper.selectById(groupId);
                        if (bean != null) {
                                Integer cnt = this.callgroupMapper.deleteById(groupId);
                                if (cnt > 0) {
                                        QueryWrapper<CallGroupMemberEntity> wrapper = new QueryWrapper<>();
                                        wrapper.eq("group_id", groupId);
                                        this.callgroupMemberMapper.delete(wrapper);
                                        return true;
                                }
                        }
                }
                return false;
        }

        @Override
        public List<CallGroupEntity> getCallGroupList(
                        String operator, String operatorOrg) {
                QueryWrapper<CallGroupEntity> wrapper = new QueryWrapper<>();
                wrapper.eq("operator", operator);
                wrapper.or();
                wrapper.eq("operator_org", operatorOrg);
                List<CallGroupEntity> list = this.callgroupMapper.selectList(wrapper);
                if (list != null) {
                        List<String> groupIds = new ArrayList<>();
                        for (CallGroupEntity callGroupEntity : list) {
                                groupIds.add(callGroupEntity.getId());
                        }

                        if (groupIds != null && groupIds.size() > 0) {
                                List<PoliceInfoEntity> members = this.callgroupMapper
                                                .selectCallGroupMemberList(groupIds);
                                if (members != null) {
                                        for (CallGroupEntity callGroupEntity : list) {
                                                List<PoliceInfoEntity> memberList = members.stream()
                                                                .filter(o -> o.getGroupId() != null
                                                                                && o.getGroupId().equals(callGroupEntity
                                                                                                .getId()))
                                                                .collect(Collectors.toList());
                                                if (memberList != null) {
                                                        callGroupEntity.setPoliceList(memberList);
                                                }
                                        }
                                }
                        }
                }
                return list;
        }

        @Override
        public Boolean updatePoliceStatus(PoliceStatusTypeEnum status, String markName, String device_code) {
                Integer cnt = this.policeDao.updateDutyStatusMark(status.getStatusCode(), markName, device_code);
                if (cnt > 0) {
                        JSONObject lbs2Data = new JSONObject();
                        // 3 是GPS 2 勤务状态 4 违规状态
                        lbs2Data.put("msgtype", "2");
                        lbs2Data.put("terminalId", device_code);
                        lbs2Data.put("sendTime", TimeUtils.currentDateTimeString());
                        lbs2Data.put("state", status.getStatusCode());
                        lbs2Data.put("stateName", markName);

                        GpsEvent event = new GpsEvent(lbs2Data);
                        context.publishEvent(event);
                        return true;
                }
                return false;
        }

        private OrgInfoWithPolicesEntity ConvertOrg(OrgInfoEntity org) {
                OrgInfoWithPolicesEntity reOrg = new OrgInfoWithPolicesEntity();
                reOrg.setOrgId(org.getOrgId());
                reOrg.setTreeId(org.getOrgId());
                reOrg.setParent(org.getParent());
                reOrg.setOrgLevelCode(org.getOrgLevel());
                reOrg.setMC(org.getName());
                reOrg.setOrgOrder(org.getOrderNumber());
                return reOrg;
        }

        private List<OrgInfoWithPolicesEntity> getChildOrgInfos(List<OrgInfoEntity> list, String orgPid,
                        List<PoliceInfoEntity> policeList) {
                List<OrgInfoEntity> filterList = list.stream()
                                .filter(o -> o.getParent() != null && o.getParent().equals(orgPid))
                                .sorted(Comparator.comparing(OrgInfoEntity::getOrderNumber, Comparator.naturalOrder()))
                                .collect(Collectors.toList());

                List<OrgInfoWithPolicesEntity> reList = new ArrayList<>();

                if (filterList != null && filterList.size() > 0) {
                        for (OrgInfoEntity orgInfo : filterList) {
                                OrgInfoWithPolicesEntity org = this.ConvertOrg(orgInfo);
                                List<PoliceInfoEntity> filterPoliceList = policeList.stream()
                                                .filter(o -> o.getOrgId() != null
                                                                && o.getOrgId().equals(orgInfo.getOrgId()))
                                                .collect(Collectors.toList());
                                List<OrgInfoWithPolicesEntity> sunOrgs = this.getChildOrgInfos(list,
                                                orgInfo.getOrgId(), policeList);
                                if (filterPoliceList != null && filterPoliceList.size() > 0) {
                                        org.setPoliceList(filterPoliceList);
                                        org.setOrgChildren(sunOrgs);
                                        reList.add(org);
                                } else {
                                        if (sunOrgs != null && sunOrgs.size() > 0) {
                                                org.setOrgChildren(sunOrgs);
                                                reList.add(org);
                                        }
                                }
                        }
                }
                return reList;
        }
}