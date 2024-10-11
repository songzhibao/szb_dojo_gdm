package comm.gis.gdm.module.police.domain;

import com.alibaba.fastjson.JSONObject;

import org.springframework.context.ApplicationEvent;

@SuppressWarnings("serial")
public class GpsEvent extends ApplicationEvent {

    public GpsEvent(JSONObject source) {
        super(source);
    }

}