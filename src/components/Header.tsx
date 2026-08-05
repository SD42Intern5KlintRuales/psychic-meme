import { Container } from "@mui/material";

const Header = () => {
    return (
        <div className="bg-white border-b shadow-sm">
            <Container maxWidth="lg" className="px-8 py-6 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                        KR
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                            KR-Valid8
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Release Document Validation Tool • Built by Klint Ruales
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Header;
