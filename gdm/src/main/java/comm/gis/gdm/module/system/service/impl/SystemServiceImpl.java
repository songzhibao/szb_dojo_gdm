package comm.gis.gdm.module.system.service.impl;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import comm.gis.gdm.mapper.*;
import comm.gis.gdm.module.system.domain.*;
import comm.gis.gdm.module.system.service.SystemService;
import comm.gis.gdm.util.TimeUtils;

@Service
public class SystemServiceImpl implements SystemService {

    @Autowired
    private UserMapper userDao;

    @Autowired
    private RoleMapper roleDao;

    @Autowired
    private PrivilegeMapper privilegeDao;

    @Autowired
    private ModuleMapper moduleDao;

    @Autowired
    private OrganizationMapper orgDao;

    @Autowired
    private DicMapper dicDao;

    @Autowired
    private CaseTypeMapper typeDao;

    @Autowired
    private ConfigMapper configDao;

    @Override
    public UserInfoEntity getSystemLoginInfo(String userName) {

        QueryWrapper<UserInfoEntity> wrapper = new QueryWrapper<>();
        wrapper.eq("code", userName);

        List<UserInfoEntity> list = this.userDao.selectList(wrapper);
        if (list != null && list.size() > 0) {
            UserInfoEntity userInfo = list.get(0);
            QueryWrapper<OrgInfoEntity> orgWrapper = new QueryWrapper<>();
            orgWrapper.eq("code", userInfo.getOrgId());
            OrgInfoEntity orgInfo = this.orgDao.selectOne(orgWrapper);
            if (orgInfo != null) {
                userInfo.setOrgInfo(orgInfo);
            }
            return userInfo;
        }
        return null;
    }

    @Override
    public List<OrgInfoEntity> getOrgInfo(List<String> orgIds) {

        return this.orgDao.selectOrgInfos(orgIds);

    }

    @Override
    public List<OrgInfoEntity> getOrgTreeInfo(List<String> orgIds) {
        List<OrgInfoEntity> list = this.orgDao.selectOrgInfos(orgIds);
        List<OrgInfoEntity> root = new ArrayList<>();
        for (String orgId : orgIds) {
            Optional<OrgInfoEntity> orgInfo = list.stream().filter(o -> o.getOrgId().equals(orgId)).findFirst();
            if (orgInfo != null && orgInfo.isPresent()) {
                root.add(orgInfo.get());
                orgInfo.get().setChildren(this.getChildOrgInfos(list, orgInfo.get().getOrgId()));
            }
        }
        return root;
    }

    @Override
    public List<ConfigInfoEntity> getConfigInfo(String module, String group, List<String> orgIds, String userId,
            List<String> code) {
        QueryWrapper<ConfigInfoEntity> wrapper = new QueryWrapper<>();
        wrapper.eq("module", module);
        wrapper.eq("userid", userId);
        if (StringUtils.hasText(group)) {
            wrapper.eq("groupname", group);
        }
        List<ConfigInfoEntity> relist = new ArrayList<>();
        List<ConfigInfoEntity> list = this.configDao.selectList(wrapper);
        if (code != null && code.size() > 0) {
            for (String oneCode : code) {
                List<ConfigInfoEntity> filterList = list.stream()
                        .filter(o -> o.getCode() != null && o.getCode().equals(oneCode)).collect(Collectors.toList());
                ConfigInfoEntity info = null;
                if (filterList == null || filterList.size() == 0) {
                    if ("orgType".equals(oneCode)) {
                        List<Map<String, Object>> caseSource = this.dicDao.selectDicOrgType();
                        if (caseSource != null) {
                            info = new ConfigInfoEntity();
                            info.setConfigjson(JSON.toJSONString(caseSource));
                        }
                    }
                    if ("orgInfo".equals(oneCode)) {
                        List<OrgInfoEntity> orgInfo = this.getOrgInfo(orgIds);
                        if (orgInfo != null) {
                            info = new ConfigInfoEntity();
                            info.setConfigjson(JSON.toJSONString(orgInfo));
                        }
                    }
                    if ("caseType".equals(oneCode)) {
                        List<CaseTypeEntity> caseType = this.getCaseTypeDic();
                        if (caseType != null) {
                            info = new ConfigInfoEntity();
                            info.setConfigjson(JSON.toJSONString(caseType));
                        }
                    }
                    if ("policeStatus".equals(oneCode)) {
                        List<PoliceStatusEntity> policeStatus = this.dicDao.selectAllDicPoliceStatus();
                        if (policeStatus != null) {
                            info = new ConfigInfoEntity();
                            info.setConfigjson(JSON.toJSONString(policeStatus));
                        }
                    }
                    if ("policeType".equals(oneCode)) {
                        List<PoliceTypeEntity> policeType = this.dicDao.selectAllDicPoliceType();
                        if (policeType != null) {
                            info = new ConfigInfoEntity();
                            info.setConfigjson(JSON.toJSONString(policeType));
                        }
                    }
                    if (info != null) {
                        info.setCode(oneCode);
                        info.setModule(module);
                        info.setGroup(group);
                        info.setUserId(userId);
                    }
                } else {
                    info = filterList.get(0);
                }
                if (info != null) {
                    relist.add(info);
                }
            }
        }
        return relist;
    }

    @Override
    public Boolean saveConfigInfo(List<ConfigInfoEntity> list) {
        if (list == null || list.size() == 0) {
            return false;
        }

        for (ConfigInfoEntity config : list) {
            QueryWrapper<ConfigInfoEntity> wrapper = new QueryWrapper<>();
            wrapper.eq("module", config.getModule());
            wrapper.eq("groupname", config.getGroup());
            wrapper.eq("userid", config.getUserId());
            wrapper.eq("code", config.getCode());
            this.configDao.delete(wrapper);
            if (config.getId() == null || "".equals(config.getId())) {
                config.setId(UUID.randomUUID().toString());
            }
            this.configDao.insert(config);
        }
        return true;
    }

    @Override
    public List<OrgInfoEntity> getOrgDDInfoByLonLat(String lon, String lat) {
        return this.orgDao.getOrgDDInfoByLonLat(lon, lat);
    }

    @Override
    public Boolean saveOrgInfo(OrgInfoEntity param) {
        if (param.getId() != null) {
            OrgInfoEntity info = this.orgDao.selectById(param.getId());
            if (info != null) {
                info.setCode(param.getCode());
                info.setName(param.getName());
                info.setOrgLevel(param.getOrgLevel());
                info.setOrderNumber(param.getOrderNumber());
                info.setTel(param.getTel());
                info.setTypeId(param.getTypeId());
                info.setMemo(param.getMemo());
                info.setValid(param.getValid());
                return this.orgDao.updateById(info) > 0;
            } else {
                return this.orgDao.insert(param) > 0;
            }
        } else {
            param.setId(TimeUtils.getTimeId());
            return this.orgDao.insert(param) > 0;
        }
    }

    @Override
    public Boolean deleteOrgInfo(List<String> orgIds) {
        QueryWrapper<OrgInfoEntity> wrapper = new QueryWrapper<>();
        wrapper.in("id", orgIds);
        return this.orgDao.delete(wrapper) > 0;
    }

    @Override
    public List<OrgInfoEntity> getOrgList(OrgInfoVO param) {
        QueryWrapper<OrgInfoEntity> orgWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(param.getCode())) {
            orgWrapper.eq("code", param.getCode());
        }
        if (StringUtils.hasText(param.getName())) {
            orgWrapper.eq("name", param.getName());
        }
        if (StringUtils.hasText(param.getOrgLevel())) {
            orgWrapper.eq("level", param.getOrgLevel());
        }
        if (param.getOrgType() > 0) {
            orgWrapper.eq("type_id", param.getOrgType());
        }
        if (param.getValid() > 0) {
            orgWrapper.eq("valid", param.getValid());
        }
        List<OrgInfoEntity> list = this.orgDao.selectList(orgWrapper);
        List<Map<String, Object>> typeList = this.dicDao.selectDicOrgType();
        for (OrgInfoEntity org : list) {
            Optional<Map<String, Object>> orgType = typeList.stream()
                    .filter(o -> o.get("id") != null && org.getTypeId() > 0
                            && o.get("id").toString().equals(org.getTypeId().toString()))
                    .findFirst();
            if (orgType != null && orgType.isPresent()) {
                org.setTypeName(orgType.get().get("name").toString());
            }
            org.setOrgId(org.getId());
        }
        return list;
    }

    @Override
    public List<Map<String, Object>> getCaseLevelDic() {
        return this.dicDao.selectDicCaseLevel();
    }

    @Autowired
    public List<CaseTypeEntity> getCaseTypeDic() {
        List<CaseTypeEntity> list = this.typeDao.selectDicCaseType();

        return list;
    }

    @Autowired
    public List<CaseTypeEntity> getCaseTypeTree() {
        List<CaseTypeEntity> list = this.typeDao.selectDicCaseType();
        List<CaseTypeEntity> root = list.stream().filter(o -> o.getParentId() == null || "".equals(o.getParentId()))
                .sorted(Comparator.comparing(CaseTypeEntity::getOrderNumber, Comparator.naturalOrder()))
                .collect(Collectors.toList());
        for (CaseTypeEntity info : root) {
            info.setChildren(this.getChildCaseTypes(list, info.getId()));
        }
        return root;
    }

    @Override
    public List<Map<String, Object>> getOrgTypeDic() {

        return this.dicDao.selectDicOrgType();

    }

    @Override
    public OrgInfoEntity getOrgInfoById(String orgId) {
        return this.orgDao.selectById(orgId);
    }

    @Override
    public List<UserInfoEntity> getUserList(UserInfoVO param) {
        QueryWrapper<UserInfoEntity> userWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(param.getCode())) {
            userWrapper.eq("code", param.getCode());
        }
        if (StringUtils.hasText(param.getName())) {
            userWrapper.eq("name", param.getName());
        }
        if (param.getOrgIds().size() > 0) {
            userWrapper.in("org_id", param.getOrgIds());
        }
        if (StringUtils.hasText(param.getPhone())) {
            userWrapper.eq("phone", param.getPhone());
        }
        if (param.getValid() > 0) {
            userWrapper.eq("valid", param.getValid());
        }
        if (param.getRoleId() != null && param.getRoleId() > 0) {
            userWrapper.inSql("id",
                    "SELECT DISTINCT(user_id) FROM gdm_sys_user_role WHERE role_id=" + param.getRoleId().toString());
        }
        List<UserInfoEntity> list = this.userDao.selectList(userWrapper);

        return list;
    }

    @Override
    public List<RoleInfoEntity> getRoleList(RoleInfoVO param) {
        QueryWrapper<RoleInfoEntity> roleWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(param.getName())) {
            roleWrapper.eq("name", param.getName());
        }
        if (param.getValid() > 0) {
            roleWrapper.eq("valid", param.getValid());
        }
        if (StringUtils.hasText(param.getUserId())) {
            roleWrapper.inSql("id",
                    "SELECT DISTINCT(role_id) FROM gdm_sys_user_role WHERE user_id =" + param.getUserId());
        }
        return this.roleDao.selectList(roleWrapper);
    }

    @Override
    public Boolean saveRoleInfo(RoleInfoEntity param) {
        if (param.getId() != null && param.getId() > 0) {
            RoleInfoEntity info = this.roleDao.selectById(param.getId());
            if (info != null) {
                info.setCode(param.getCode());
                info.setName(param.getName());
                info.setMemo(param.getMemo());
                info.setValid(param.getValid());
                return this.roleDao.updateById(info) > 0;
            } else {
                return this.roleDao.insert(param) > 0;
            }
        } else {
            param.setId(TimeUtils.getIntegerId());
            return this.roleDao.insert(param) > 0;
        }
    }

    @Override
    public Boolean deleteRoleInfo(List<Long> roleIds) {
        QueryWrapper<RoleInfoEntity> roleWrapper = new QueryWrapper<>();
        roleWrapper.in("id", roleIds);
        return this.roleDao.delete(roleWrapper) > 0;
    }

    @Override
    public RoleInfoEntity getOneRoleInfo(Long roleId) {
        return this.roleDao.selectById(roleId);
    }

    @Override
    public List<ModuleInfoEntity> getPrivilegeList(PrivilegeInfoVO param) {

        List<ModuleInfoEntity> moduleList = this.moduleDao.selectList(null);

        QueryWrapper<PrivilegeInfoEntity> roleWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(param.getUserId())) {
            roleWrapper.inSql("id",
                    "SELECT DISTINCT(privilege_id) FROM gdm_sys_user_privilege WHERE user_id ='" + param.getUserId()
                            + "'");
        }
        if (StringUtils.hasText(param.getRoleId())) {
            roleWrapper.inSql("id",
                    "SELECT DISTINCT(privilege_id) FROM gdm_sys_role_privilege WHERE role_id ='" + param.getRoleId()
                            + "'");
        }
        List<PrivilegeInfoEntity> list = this.privilegeDao.selectList(roleWrapper);
        for (ModuleInfoEntity module : moduleList) {
            List<PrivilegeInfoEntity> filterList = list.stream()
                    .filter(o -> o.getModuleId() != null && o.getModuleId().equals(module.getId()))
                    .sorted(Comparator.comparing(PrivilegeInfoEntity::getOrderNumber, Comparator.naturalOrder()))
                    .collect(Collectors.toList());
            if (filterList != null && filterList.size() > 0) {
                module.setChildren(filterList);
            } else {
                module.setChildren(null);
            }
        }
        return moduleList;
    }

    @Override
    public UserInfoEntity getOneUserInfo(Long userId) {
        return this.userDao.selectById(userId);
    }

    @Override
    public Boolean saveUserInfo(UserInfoEntity param) {
        Boolean isOK = false;
        if (param.getId() != null && param.getId() > 0) {
            UserInfoEntity info = this.userDao.selectById(param.getId());
            if (info != null) {
                info.setCode(param.getCode());
                info.setName(param.getName());
                info.setMemo(param.getMemo());
                info.setOrgId(param.getOrgId());
                info.setPhone(param.getPhone());
                isOK = this.userDao.updateById(info) > 0;
            } else {
                isOK = this.userDao.insert(param) > 0;
            }
        } else {
            param.setId(TimeUtils.getIntegerId());
            isOK = this.userDao.insert(param) > 0;
        }
        if (isOK) {
            if (param.getRoleIds() != null && param.getRoleIds().size() > 0) {
                this.userDao.deleteUserRoleIds(param.getId());
                for (Long roleId : param.getRoleIds()) {
                    this.userDao.insertUserRoleIds(param.getId(), roleId);
                }
            }

            if (param.getPrivilegeIds() != null && param.getPrivilegeIds().size() > 0) {
                this.userDao.deleteUserPrivilegeIds(param.getId());
                for (Long privilegeId : param.getPrivilegeIds()) {
                    this.userDao.insertUserPrivilegeIds(param.getId(), privilegeId);
                }
            }
        }
        return isOK;
    }

    @Override
    public Boolean deleteUserInfo(List<Integer> userIds) {
        QueryWrapper<UserInfoEntity> userWrapper = new QueryWrapper<>();
        userWrapper.in("id", userIds);
        return this.userDao.delete(userWrapper) > 0;
    }

    private List<CaseTypeEntity> getChildCaseTypes(List<CaseTypeEntity> list, String typePid) {
        List<CaseTypeEntity> filterList = list.stream()
                .filter(o -> o.getParentId() != null && o.getParentId().equals(typePid))
                .sorted(Comparator.comparing(CaseTypeEntity::getOrderNumber, Comparator.naturalOrder()))
                .collect(Collectors.toList());
        if (filterList != null && filterList.size() > 0) {
            for (CaseTypeEntity typeInfo : filterList) {
                typeInfo.setChildren(this.getChildCaseTypes(list, typeInfo.getId()));
            }
            return filterList;
        } else {
            return null;
        }
    }

    private List<OrgInfoEntity> getChildOrgInfos(List<OrgInfoEntity> list, String orgPid) {
        List<OrgInfoEntity> filterList = list.stream()
                .filter(o -> o.getParent() != null && o.getParent().equals(orgPid))
                .sorted(Comparator.comparing(OrgInfoEntity::getOrderNumber, Comparator.naturalOrder()))
                .collect(Collectors.toList());
        if (filterList != null && filterList.size() > 0) {
            for (OrgInfoEntity orgInfo : filterList) {
                orgInfo.setChildren(this.getChildOrgInfos(list, orgInfo.getOrgId()));
            }
            return filterList;
        } else {
            return null;
        }
    }
}
