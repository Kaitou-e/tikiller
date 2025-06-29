import CustomButton from '../react/src/components/Toolbar/CustomButton.tsx'
import {useDialog} from '../react/src/hooks/useDialog.tsx'

function iconAbout({size=24, color="currentColor", stroke=2, ...props}) {
    // Source: Deepseek
  return (
      <svg 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    strokeWidth={stroke}
    stroke={color}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}>
        <circle cx="12" cy="12" r="10"  />
          <path d="M12 16V12" />
            <circle cx="12" cy="8" r="1" fill={color} />
            </svg>
  )
}


function About(){
    const { showDialog, hideDialog } = useDialog();
    const tooltip="About"
    const key="aboutButtom"
    const icon= iconAbout({size:24, color:"#202020", stroke:1})

    return (
      <CustomButton 
        key={key}
        tooltip={tooltip}
        icon = {icon}
        onClick={()=>{
            showDialog(
                (
                    <>
                    <h3>About</h3 >
                    <p>HoYoverse is a global gaming company known for creating popular titles like Genshin Impact, Honkai Impact 3rd, and Honkai: Star Rail. Originally part of miHoYo, it rebranded in 2022 to expand its international presence. Based in Singapore with studios worldwide, HoYoverse specializes in high-quality anime-style games with open-world exploration and deep storytelling. Their games are free-to-play with gacha mechanics, attracting millions of players. The company focuses on immersive worlds, strong character designs, and cross-platform gameplay. With a mix of action, RPG, and sci-fi themes, HoYoverse continues to grow as a leader in the gaming industry, appealing to both casual and hardcore gamers.</p>
                    </>
                ),
                "ok"
            )

        }} />
    )
}

export default About;

