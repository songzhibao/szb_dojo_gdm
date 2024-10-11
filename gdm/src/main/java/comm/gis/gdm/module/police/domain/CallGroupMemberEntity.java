package comm.gis.gdm.module.police.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.baomidou.mybatisplus.annotation.TableName;

@Data
@TableName("gdm_sys_call_group_member")
public class CallGroupMemberEntity {

    @ApiModelProperty("ID")
    private String id;

    @ApiModelProperty("排序编号")
    private String orderNum;

    @ApiModelProperty("人员编号")
    private String personId;

    @ApiModelProperty("分组编号")
    private String groupId;

    @ApiModelProperty("是否有效")
    private Integer valid;

}
