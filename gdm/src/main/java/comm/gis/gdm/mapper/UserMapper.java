package comm.gis.gdm.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import comm.gis.gdm.module.system.domain.UserInfoEntity;

@Mapper
public interface UserMapper extends BaseMapper<UserInfoEntity> {

    @Delete("insert into gdm_sys_user_role(user_id,role_id) values(#{userId},#{roleId})")
    Integer insertUserRoleIds(Long userId, Long roleId);

    @Delete("delete from gdm_sys_user_role where user_id = #{userId}")
    Integer deleteUserRoleIds(Long userId);

    @Delete("insert into gdm_sys_user_privilege(user_id,privilege_id) values(#{userId},#{privilegeId})")
    Integer insertUserPrivilegeIds(Long userId, Long roleId);

    @Delete("delete from gdm_sys_user_privilege where user_id = #{userId}")
    Integer deleteUserPrivilegeIds(Long userId);
}
