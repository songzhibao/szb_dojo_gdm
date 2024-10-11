package comm.gis.gdm.module.system.service;

import java.util.*;

import comm.gis.gdm.module.system.domain.*;

public interface SystemService {
    /**
     * 获取认证登录信息
     *
     * @return 用户信息
     */
    UserInfoEntity getSystemLoginInfo(String token);

    /*
     * 获取单位信息根据坐标
     */
    List<OrgInfoEntity> getOrgDDInfoByLonLat(String lon, String lat);

    /*
     * 获取组织机构数据
     */
    List<OrgInfoEntity> getOrgInfo(List<String> orgIds);

    /*
     * 获取组织机构树形数据
     */
    List<OrgInfoEntity> getOrgTreeInfo(List<String> orgIds);

    /*
     * 保存机构数据
     */
    Boolean saveOrgInfo(OrgInfoEntity param);

    /*
     * 删除单位数据
     */
    Boolean deleteOrgInfo(List<String> orgIds);

    /*
     * 获取配置信息
     */
    List<ConfigInfoEntity> getConfigInfo(String module, String group, List<String> orgIds, String userId,
            List<String> code);

    /*
     * 保存配置信息
     */
    Boolean saveConfigInfo(List<ConfigInfoEntity> list);

    /*
     * 查询组织机构数据
     */
    List<OrgInfoEntity> getOrgList(OrgInfoVO param);

    /*
     * 获取单位类型字典数据
     */
    List<Map<String, Object>> getOrgTypeDic();

    /*
     * 获取类型字典数据
     */
    List<CaseTypeEntity> getCaseTypeDic();

    /*
     * 获取类型字典数据
     */
    List<CaseTypeEntity> getCaseTypeTree();

    /*
     * 获取警情等级字典数据
     */
    List<Map<String, Object>> getCaseLevelDic();

    /*
     * 获取某个组织机构数据
     */
    OrgInfoEntity getOrgInfoById(String orgId);

    /*
     * 查询用户信息数据
     */
    List<UserInfoEntity> getUserList(UserInfoVO param);

    /*
     * 获取所有用户角色数据
     */
    List<RoleInfoEntity> getRoleList(RoleInfoVO param);

    /*
     * 保存用户角色数据
     */
    Boolean saveRoleInfo(RoleInfoEntity param);

    /*
     * 删除用户角色数据
     */
    Boolean deleteRoleInfo(List<Long> roleIds);

    /*
     * 获取某个角色数据
     */
    RoleInfoEntity getOneRoleInfo(Long roleId);

    /*
     * 获取权限点数据
     */
    List<ModuleInfoEntity> getPrivilegeList(PrivilegeInfoVO param);

    /*
     * 获取某个用户详细信息
     */
    UserInfoEntity getOneUserInfo(Long userId);

    /*
     * 保存用户数据
     */
    Boolean saveUserInfo(UserInfoEntity param);

    /*
     * 删除用户数据
     */
    Boolean deleteUserInfo(List<Integer> userIds);
}
