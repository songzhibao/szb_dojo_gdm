package comm.gis.gdm.module.system.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;

import comm.gis.gdm.common.code.UserErrorCode;
import comm.gis.gdm.common.domain.ResponseResult;
import comm.gis.gdm.module.system.domain.*;
import comm.gis.gdm.module.system.service.SystemService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(tags = "系统基础接口")
@RestController
@RequestMapping("/system")
public class SystemController {

    @Autowired
    private SystemService sytemService;

    @ApiOperation(value = "保存用户配置信息数据")
    @PostMapping("/saveConfigInfo")
    public ResponseResult<Boolean> saveConfigInfo(@RequestBody List<ConfigInfoEntity> param) {

        try {
            Boolean isSave = this.sytemService.saveConfigInfo(param);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("保存用户配置信息数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "获取用户配置信息数据")
    @PostMapping("/getConfigInfo")
    public ResponseResult<List<ConfigInfoEntity>> getConfigInfo(@RequestBody ConfigInfoVO param) {

        try {
            List<ConfigInfoEntity> bean = this.sytemService.getConfigInfo(param.getModule(), param.getGroup(),
                    param.getOrgIds(), param.getUserId(), param.getCode());
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取用户配置信息数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "保存用户数据")
    @PostMapping("/saveUserInfo")
    public ResponseResult<Boolean> saveUserInfo(@RequestBody UserInfoEntity param) {

        try {
            Boolean isSave = this.sytemService.saveUserInfo(param);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("保存用户数据 参数：" + JSON.toJSONString(param) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "userName", value = "用户账户", paramType = "path", required = true, dataTypeClass = String.class),
    })
    @ApiOperation(value = "获取用户详细信息")
    @GetMapping("/login/{userName}")
    public ResponseResult<UserInfoEntity> getSystemLoginInfo(@PathVariable("userName") String userId) {

        try {
            UserInfoEntity bean = this.sytemService.getSystemLoginInfo(userId);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取用户详细信息 参数：" + userId + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "用户ID", required = true, dataTypeClass = String.class),
    })
    @ApiOperation(value = "获取某个用户详细信息")
    @PostMapping("/getOneUserInfo")
    public ResponseResult<UserInfoEntity> getOneUserInfo(@RequestParam Long userId) {

        try {
            UserInfoEntity bean = this.sytemService.getOneUserInfo(userId);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取某个用户详细信息 参数：" + userId + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "查询用户信息数据")
    @PostMapping("/getUserList")
    public ResponseResult<List<UserInfoEntity>> getUserList(@RequestBody UserInfoVO param) {

        try {
            List<UserInfoEntity> bean = this.sytemService.getUserList(param);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("查询用户信息数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParam(name = "userIds", value = "用户编号数组", required = true, dataType = "List<Integer>", dataTypeClass = Integer.class)
    @ApiOperation(value = "删除用户数据")
    @PostMapping("/deleteUserInfo")
    public ResponseResult<Boolean> deleteUserInfo(@RequestParam List<Integer> userIds) {

        try {
            Boolean isSave = this.sytemService.deleteUserInfo(userIds);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("删除用户数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "获取权限点数据")
    @PostMapping("/getPrivilegeList")
    public ResponseResult<List<ModuleInfoEntity>> getPrivilegeList(@RequestBody PrivilegeInfoVO param) {

        try {
            List<ModuleInfoEntity> bean = this.sytemService.getPrivilegeList(param);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取权限点数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "获取用户角色数据")
    @PostMapping("/getRoleList")
    public ResponseResult<List<RoleInfoEntity>> getRoleList(@RequestBody RoleInfoVO param) {

        try {
            List<RoleInfoEntity> bean = this.sytemService.getRoleList(param);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取所有用户角色数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParam(name = "roleId", value = "角色编号", required = true, dataType = "Long", dataTypeClass = Long.class)
    @ApiOperation(value = "获取某个角色数据")
    @PostMapping("/getOneRoleInfo")
    public ResponseResult<RoleInfoEntity> getOneRoleInfo(@RequestParam Long roleId) {

        try {
            RoleInfoEntity bean = this.sytemService.getOneRoleInfo(roleId);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取某个角色数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "保存用户角色数据")
    @PostMapping("/saveRoleInfo")
    public ResponseResult<Boolean> saveRoleInfo(@RequestBody RoleInfoEntity param) {

        try {
            Boolean isSave = this.sytemService.saveRoleInfo(param);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("保存用户角色数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParam(name = "roleIds", value = "角色编号数组", required = true, dataType = "List<Integer>", dataTypeClass = Integer.class)
    @ApiOperation(value = "删除用户角色数据")
    @PostMapping("/deleteRoleInfo")
    public ResponseResult<Boolean> deleteRoleInfo(@RequestParam List<Long> roleIds) {

        try {
            Boolean isSave = this.sytemService.deleteRoleInfo(roleIds);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("删除用户角色数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParam(name = "orgCodes", value = "单位编号数组", required = true, dataType = "List<String>", dataTypeClass = String.class)
    @Operation(summary = "获取组织机构数据")
    @PostMapping("/getOrgInfo")
    public ResponseResult<List<OrgInfoEntity>> getOrgInfo(
            @RequestParam List<String> orgCodes) {

        try {
            List<OrgInfoEntity> result = this.sytemService.getOrgInfo(
                    orgCodes);
            if (result != null && result.size() > 0) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取组织机构数据 参数：" + JSON.toJSONString(orgCodes) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParam(name = "orgCodes", value = "单位编号数组", required = true, dataType = "List<String>", dataTypeClass = String.class)
    @Operation(summary = "获取组织机构树形数据")
    @PostMapping("/getOrgTreeInfo")
    public ResponseResult<List<OrgInfoEntity>> getOrgTreeInfo(
            @RequestParam List<String> orgCodes) {

        try {
            List<OrgInfoEntity> result = this.sytemService.getOrgTreeInfo(
                    orgCodes);
            if (result != null && result.size() > 0) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取组织机构树形数据" + " 参数：" + JSON.toJSONString(orgCodes) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "查询组织机构数据")
    @PostMapping("/getOrgList")
    public ResponseResult<List<OrgInfoEntity>> getOrgList(@RequestBody OrgInfoVO param) {

        try {
            List<OrgInfoEntity> bean = this.sytemService.getOrgList(param);
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("查询组织机构数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "保存机构数据")
    @PostMapping("/saveOrgInfo")
    public ResponseResult<Boolean> saveOrgInfo(@RequestBody OrgInfoEntity param) {

        try {
            Boolean isSave = this.sytemService.saveOrgInfo(param);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("保存机构数据 参数：" + JSON.toJSONString(param) + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParam(name = "orgIds", value = "角色编号数组", required = true, dataType = "List<Integer>", dataTypeClass = Integer.class)
    @ApiOperation(value = "删除单位数据")
    @PostMapping("/deleteOrgInfo")
    public ResponseResult<Boolean> deleteOrgInfo(@RequestParam List<String> orgIds) {

        try {
            Boolean isSave = this.sytemService.deleteOrgInfo(orgIds);
            if (isSave != null) {
                return ResponseResult.ok(isSave);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("删除单位数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiImplicitParam(name = "orgId", value = "单位ID", required = true, dataType = "String", dataTypeClass = String.class)
    @Operation(summary = "获取某个组织机构数据")
    @PostMapping("/getOrgInfoById")
    public ResponseResult<OrgInfoEntity> getOrgInfoById(
            @RequestParam String orgId) {

        try {
            OrgInfoEntity result = this.sytemService.getOrgInfoById(
                    orgId);
            if (result != null) {
                return ResponseResult.ok(result);
            } else {
                return ResponseResult.okMsg("查询无数据");
            }
        } catch (Exception e) {
            log.error("获取某个组织机构数据 参数：" + orgId + " 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "获取警情案由字典数据")
    @GetMapping("/getCaseTypeDic")
    public ResponseResult<List<CaseTypeEntity>> getCaseTypeDic() {

        try {
            List<CaseTypeEntity> bean = this.sytemService.getCaseTypeDic();
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取警情案由字典数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "获取警情等级字典数据")
    @GetMapping("/getCaseLevelDic")
    public ResponseResult<List<Map<String, Object>>> getCaseLevelDic() {

        try {
            List<Map<String, Object>> bean = this.sytemService.getCaseLevelDic();
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取警情等级字典数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

    @ApiOperation(value = "获取单位类型字典数据")
    @PostMapping("/getOrgTypeDic")
    public ResponseResult<List<Map<String, Object>>> getOrgTypeDic() {

        try {
            List<Map<String, Object>> bean = this.sytemService.getOrgTypeDic();
            if (bean != null) {
                return ResponseResult.ok(bean);
            } else {
                return ResponseResult.error(UserErrorCode.DATA_NOT_EXIST, false);
            }
        } catch (Exception e) {
            log.error("获取单位类型字典数据 异常：", e);
            return ResponseResult.error(UserErrorCode.PARAM_ERROR, e.getMessage());
        }
    }

}
