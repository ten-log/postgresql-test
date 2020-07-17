const express = require('express'),
      bodyParser = require('body-parser'),  //post 쓰려고
      cors = require('cors'),
      app = express(); //앱에 적용
const port = 5000;
// postgresql 에서 db 값을 가져오기위한 데이터
const Pool = require('pg-pool');


const config = {
  user: 'yeol',
  password:'038100',
  host: 'localhost',
  port: 5432,
  database: 'tunneldata',
};
let pool = new Pool(config);
 app.use(cors());  // 외부와의 연결 허용

//바디 파서 ->  post 값 받기 위해 사용
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

function add_zero(num){
  if(num<10)return '0'+num.toString();
  return num.toString();
}

    //이벤트 테이블
    // insert into eventtable (ev_id, ev_class , ev_source , ev_st, ev_et, ev_cause, ev_robot_m, ev_sms, ev_file) values ('2','alert', '로봇카메라', '20.07.14 00:00:01', '20.07.14 00:00:03', '화재', 'y', 'y','다운로드파일');

let temp_rand;
let temp_max =32;
let temp_min= 22;
let ts_m=0;
let ts_h=0;
let ts_zero='';
let fbg_sql;

app.get('/', (req, res)=>{ //내가 홈페이지 클릭해야 발동
      pool.connect().then(client => {

        for(let i=0; i<5; i++){

            temp_rand = Math.floor( Math.random()*(temp_max -temp_min)+temp_min );
            ts_m+=1;
            if(ts_m ==60){
              ts_m=0;
              ts_h+=1;
            }
            fbg_sql = `insert into fbgtable (fbg_ts, fbg_temp) values(\'20.07.14 ${add_zero(ts_h)}:${add_zero(ts_m)}:00\' , \'${temp_rand}\')`;


        client.query(fbg_sql).then(result => {
          client.release();  //매번 db를 쓰면 쓰고 종료했다는 표시 해줘야함
          console.log(result.rows);
          res.send(result.rows);
        console.log('return json type:', result.rows)
        })
        .catch(e => {
          client.release()
          console.error('query error', e.message, e.stack)
        })
      })
    }
});

app.listen(port , ()=>{
  console.log(`start server port:${port}`)
})
