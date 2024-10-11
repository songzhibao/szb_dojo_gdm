package comm.gis.gdm.module.duty.domain;

import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_duty_xlry")
public class DutyPersonEntity {

    @ApiModelProperty("id")
    private Long id;

    @ApiModelProperty("编号")
    private String code;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("职务")
    private String job;

    @ApiModelProperty("手机号码")
    private String phone;

    @ApiModelProperty("图形编号")
    private Long dutyId;

}
