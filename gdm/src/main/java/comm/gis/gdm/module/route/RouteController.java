package comm.gis.gdm.module.route;

import java.net.URLEncoder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.alibaba.fastjson.JSON;

import comm.gis.gdm.module.system.domain.UserInfoEntity;
import comm.gis.gdm.module.system.service.SystemService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class RouteController {

    @Autowired
    private SystemService sytemService;

    @GetMapping("/")
    public String getIndex(Model model, HttpServletRequest request) {
        UserInfoEntity info = isHaveLogin(model, request);
        if (info != null) {
            return "Home/Index";
        }
        return "Home/Login";
    }

    @GetMapping("/Home/Logout")
    public String getLogout(Model model, HttpServletRequest request) {
        request.getSession().setAttribute("currentUser", null);
        model.addAttribute("loginMsg", "已经退出系统");
        return "Home/Login";
    }

    @GetMapping("/login")
    public String getLogin(Model model) {
        return "Home/Login";
    }

    @PostMapping("/login/check")
    public String postLoginCheck(Model model, @RequestParam String username, @RequestParam String password,
            HttpServletRequest request, HttpServletResponse response) {
        String msg = "";
        try {
            UserInfoEntity info = this.sytemService.getSystemLoginInfo(username);
            if (info != null) {
                if (info.getPassword() != null && info.getPassword().equals(password)) {
                    request.getSession().setAttribute("currentUser", info);
                    model.addAttribute("currentUser", info);
                    String cookieContent = URLEncoder.encode(JSON.toJSONString(info), "utf-8");
                    Cookie cookie = new Cookie("dsAuthenticationUser", cookieContent);
                    cookie.setMaxAge(Integer.MAX_VALUE);
                    response.addCookie(cookie);
                    return "Home/Index";
                } else {
                    msg = "您输入密码不正确";
                }
            } else {
                msg = "您输入账户不存在";
            }
        } catch (Exception e) {
            log.error("用户登陆审核 异常：", e);
            msg = "用户登陆审核 异常：" + e.getMessage();
        }
        model.addAttribute("loginMsg", msg);
        return "Home/Login";
    }

    @GetMapping("/Alarm/Index")
    public String getAlarm(Model model, HttpServletRequest request) {
        UserInfoEntity info = isHaveLogin(model, request);
        if (info != null) {
            return "Alarm/Index";
        }
        return "Home/Login";
    }

    @GetMapping("/Duty/Index")
    public String getDuty(Model model, HttpServletRequest request) {
        UserInfoEntity info = isHaveLogin(model, request);
        if (info != null) {
            return "Duty/Index";
        }
        return "Home/Login";
    }

    @GetMapping("/Deduce/Index")
    public String getDeduce(Model model, HttpServletRequest request) {
        UserInfoEntity info = isHaveLogin(model, request);
        if (info != null) {
            return "Deduce/Index";
        }
        return "Home/Login";
    }

    @GetMapping("/Case/Index")
    public String getCase(Model model, HttpServletRequest request) {
        UserInfoEntity info = isHaveLogin(model, request);
        if (info != null) {
            return "Case/Index";
        }
        return "Home/Login";
    }

    @GetMapping("/Chart/Index")
    public String getChart(Model model, HttpServletRequest request) {
        UserInfoEntity info = isHaveLogin(model, request);
        if (info != null) {
            return "Chart/Index";
        }
        return "Home/Login";
    }

    @GetMapping("User/Index")
    public String getUser(Model model, HttpServletRequest request) {
        UserInfoEntity info = isHaveLogin(model, request);
        if (info != null) {
            return "User/Index";
        }
        return "Home/Login";
    }

    private UserInfoEntity isHaveLogin(Model model, HttpServletRequest request) {
        Object currentObj = request.getSession().getAttribute("currentUser");
        if (currentObj != null) {
            model.addAttribute("currentUser", currentObj);

            return (UserInfoEntity) currentObj;
        } else {
            model.addAttribute("loginMsg", "请重新登陆");
            return null;
        }
    }
}
