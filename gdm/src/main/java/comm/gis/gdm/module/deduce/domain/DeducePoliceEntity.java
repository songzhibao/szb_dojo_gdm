package comm.gis.gdm.module.deduce.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_deduce_police")
public class DeducePoliceEntity {

    @ApiModelProperty("ID")
    private Long Id;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("编号")
    private String code;

    @ApiModelProperty("职务")
    private String job;

    @ApiModelProperty("坐标")
    private String zb;

    @ApiModelProperty("")
    private String zz;

    @ApiModelProperty("联系电话")
    private String phone;

    @ApiModelProperty("单位编码")
    private Long orgId;

    @ApiModelProperty("任务编号")
    private String taskId;

    @ApiModelProperty("阶段编号")
    private Long guaId;

}
