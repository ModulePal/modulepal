package me.omartanner.modulepal;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

// testing
@Slf4j
@CrossOrigin
@RestController
public class GreetingController {
    /*@GetMapping("/greeting")
    public String greeting(@RequestParam(value = "n", defaultValue = "World") String name) {
        try {
            int x = 10 / 0;
        }
        catch (Exception e) {
            log.error("EXAMPLE ERROR LOGGING", e);
        }
        return "Hi.";
    }*/

//    @RequestMapping("/_ah/health")
//    public ResponseEntity<String> healthCheck() {
//        return new ResponseEntity<>("Healthy", HttpStatus.OK);
//    }
}
