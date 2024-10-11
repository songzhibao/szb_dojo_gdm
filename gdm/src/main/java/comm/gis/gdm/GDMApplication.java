package comm.gis.gdm;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

@ComponentScan(basePackages = { "comm.gis.gdm" })
@MapperScan(value = "comm.gis.gdm", annotationClass = Mapper.class)
@SpringBootApplication
@EnableAsync
public class GDMApplication {

	public static void main(String[] args) {
		SpringApplication.run(GDMApplication.class, args);
	}

}
